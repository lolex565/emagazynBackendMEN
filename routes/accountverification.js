const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.route('/:registrationToken').get(async (req, res) => {
    const token = req.params.registrationToken;
    if (!token) return res.status(401).json({error: "no token token"});

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user);
        await User.findOneAndUpdate({email: req.user.email}, {verified: true});
        res.json({message:'verified account'});
    } catch (err) {
        res.status(400).json({error: "token not valid"});
    }
});

module.exports = router;