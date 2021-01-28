const router = require("express").Router();
const User = require("../models/user.model");

router.route("/").delete((req, res) => {
    if (req.body.confirmation == true) {
        User.findOneAndDelete({ email: req.user.email })
            .then(res.json({ message: "success", success: true }))
            .catch(
                err,
                res
                    .status(400)
                    .json({ error: String("error: " + err), success: false })
            );
    } else {
        res.json({ message: "user deletion not confirmed", success: false });
    }
});

module.exports = router;
