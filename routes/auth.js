const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require("../validation");

router.route('/register').post(async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    if (error) return res.status(400).json({error: error.details[0].message});

    const doesEmailExist = await User.findOne({email: req.body.email});

    if (doesEmailExist) return res.status(400).json({error: "Email already exists"});

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password,
        roles: {
            admin: false,
            store: false,
            archive: false,
            library: false,
        },
    });

    const verificationToken = jwt.sign(
        {
            name: user.name,
            id: user._id,                   //TODO wysyłać token weryfikacyjny mailem
            email: user.email
        },
        process.env.TOKEN_SECRET
    );

    user.save()
        .then(() => res.json({message:'item added!',verificationToken: verificationToken}))
        .catch(err => res.status(400).json('error :' + err));
});

router.route('/login').post(async(req, res) => {
    const { error } = loginValidation(req.body);

    if(error) return res.status(400).json({ error:   error.details[0].message });

    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(400).json({error: "wrong email"});

    if(!user.verified) return res.status(400).json({error: "user not verified"});

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).json({error: "wrong password"});

    
    const token = jwt.sign(
    {
        name: user.name,
        id: user._id,
        email: user.email,
        roles: user.roles,
    },
    process.env.TOKEN_SECRET
    );
    
    res.header("auth-token", token).json({
        error: null,
        data:{
            message: "login successful",
            token,
        },
    });
});

//TODO dodać odświeżanie i wygasanie tokena

//TODO dodać przywracanie hasła

module.exports = router;