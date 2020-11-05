const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({error: "access denied"});

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({error: "token not valid"});
    }
};

module.exports = verifyToken;