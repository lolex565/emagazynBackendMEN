const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/').get(async (req, res) => {
    
    

    const token = jwt.sign(
        {
            name: req.user.name,
            id: req.user._id,
            email: req.user.email,
            roles: req.user.roles,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "72h"
        }
        );
        
        res.header("auth-token", token).json({
            error: null,
            data:{
                message: "token renewed",
                token,
            },
        });
});

module.exports = router;