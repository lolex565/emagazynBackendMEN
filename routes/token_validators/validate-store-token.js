const jwt = require("jsonwebtoken");

const verifyStoreToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ error: "access denied" });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        if (req.user.roles.store == true || req.user.roles.admin == true) {
            next();
        } else {
            res.status(401).json({ error: "access denied" });
        }
    } catch (err) {
        res.status(400).json({ error: "token not valid" });
    }
};

module.exports = verifyStoreToken;
