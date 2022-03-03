const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { registerValidation, loginValidation } = require("../validation");
const verifyToken = require("../functions/verifyToken");

router.route("/register").post(async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }
    if (error)
        return res.status(400).json({
            error: error.details[0].message,
        });

    const doesEmailExist = await User.findOne({
        email: req.body.email,
    });

    if (doesEmailExist)
        return res.status(400).json({
            error: "Email already exists",
        });

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
            id: user._id,
            email: user.email,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "24h",
        }
    );

    let emailBody =
        "aby zweyfikować swoje konto w systemie EMagazyn, wklej poniższy token w odpowiednie pole na stronie " +
        process.env.ADRESS +
        "/verify.html <br /><b>" +
        verificationToken +
        "</b>";
    //TODO przepisać maila w funkcje
    let transporter = nodemailer.createTransport({
        host: String(process.env.EMAIL_SMTP_HOST),
        port: process.env.EMAIL_SMTP_PORT,
        secure: false,
        auth: {
            user: String(process.env.EMAIL_LOGIN),
            pass: String(process.env.EMAIL_PASSWORD),
        },
        tls: {
            ciphers: "SSLv3",
        },
    });

    transporter.verify((err) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        }
    });

    let email = await transporter.sendMail({
        from:
            '"system emagazyn noreply" <' +
            String(process.env.EMAIL_LOGIN) +
            ">",
        to: String(user.email),
        subject: "weryfikacja konta w systemie emagazyn",
        html: emailBody,
    });

    user.save()
        .then(() =>
            res.json({
                message: "user registered!",
            })
        )
        .catch((err) =>
            res.status(400).json({
                error: err,
            })
        );
});

router.route("/login").post(async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error)
        return res.status(400).json({
            error: error.details[0].message,
            errorCode: 0,
        });

    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user)
        return res.status(400).json({
            error: "wrong email",
            errorCode: 1,
        });

    if (!user.verified)
        return res.status(400).json({
            error: "user not verified",
            errorCode: 2,
        });

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword)
        return res.status(400).json({
            error: "wrong password",
            errorCode: 3,
        });

    const token = jwt.sign(
        {
            name: user.name,
            id: user._id,
            email: user.email,
            roles: user.roles,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    res.header("auth-token", token).json({
        error: null,
        data: {
            message: "login successful",
            token,
        },
    });
});

router.route("/refresh").get(async (req, res) => {
    let token = req.header("auth-token");
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    
    const user = await User.findOne({
        email: verified.email,
    });
    const newToken = jwt.sign(
        {
            name: user.name,
            id: user._id,
            email: user.email,
            roles: user.roles,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    res.header("auth-token", token).json({
        error: null,
        data: {
            message: "refresh",
            newToken,
        },
    });
})
//TODO dodać odświeżanie i wygasanie tokena

//TODO dodać przywracanie hasła

module.exports = router;
