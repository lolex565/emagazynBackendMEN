const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(Users => res.json(Users))
        .catch(err => res.status(400).json("error: "+err));
});

router.route('/:email').get((req, res) => {
    User.findOne({
            email: String(req.params.email)
        })
        .then(User => res.json(User))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/:email').patch((req, res) => {
    const isAdmin = req.body.roles.admin;
    const isStore = req.body.roles.store;
    const isLibrary = req.body.roles.library;
    const isArchive = req.body.roles.archive;
    User.findOneAndUpdate({
            email: String(req.params.email)
        }, {
            roles: {
                admin: isAdmin,
                store: isStore,
                library: isLibrary,
                archive: isArchive,
            },
        })
        .then(User => res.json(User)).redirect(String(process.env.ADDRESS + '/admin'))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/:email').delete((req, res) => { //TODO zablokuj usuwanie innych adminów
    if (req.body.confirmation == true) {
        User.findOneAndDelete({"email": req.params.email})
            .then(res.json({message: "success"})).redirect(String(process.env.ADDRESS + '/admin'))
            .catch(err, res.status(400).json({error: String("error: " + err)}));
    } else {
        res.json({message: "user deletion not confirmed"})
    };
});

module.exports = router;