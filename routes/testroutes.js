const router = require("express").Router();
const test = require("../functions/testfile");

router.route("/").get((req, res) => {
    let x = {
        cipa: "cyce",
        wadowice: true,
    };

    res.status(200).header(test.giveHeader()).json(x);
});

module.exports = router;
