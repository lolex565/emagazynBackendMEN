const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').delete( (req, res) => {
    if (req.body.confirmation == true) {
        User.findOneAndDelete({"email": req.user.email})
            .then(res.json({message: "success"}))
            .catch(err, res.status(400).json({error: String("error: " + err)}));
    };
});

module.exports = router;