const router = require('express').Router();
const Store = require('../models/store.model');

router.route('/').get((req, res) => {
    Store.find()
        .then(storeItems => res.json(storeItems))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/:storeId').get((req, res) => {
    Store.findOne({
            storeId: String(process.env.STORE_PREFIX + req.params.storeId)
        })
        .then(storeItem => res.json(storeItem))
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;