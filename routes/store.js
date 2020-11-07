const router = require('express').Router();
const Store = require('../models/store.model');
const Counter = require('../models/counter.model');

router.route('/').delete((req, res) => {
    if (req.body.dropSecret == process.env.DROP_COLLECTION) {
        Store.deleteMany({})
            .then(res.json("dropped collection")).redirect(String(process.env.ADDRESS + '/public/store'))
            .catch(err => res.status(400).json('error :' + err));
    } else {
        res.json("wrong code")
    }
});

router.route('/add').post((req, res) => {

    async function addStoreItem(storeOldId, storeName, storeStatus) {
        const counter = await Counter.findOne({module:"store"});
        const stamp = String(Number(counter.count+1)).padStart(5, 0);
        const storeId = String(process.env.STORE_PREFIX+stamp);
        const newCount = Number(counter.count+1);

        const newItem = new Store({
            storeId,
            storeOldId,
            storeName,
            storeStatus,
        });

        newItem.save()
            .then(async () => {
                let doc = await Counter.findOneAndUpdate({module:"store"}, {count: newCount})
                res.json('item added!').redirect(String(process.env.ADDRESS + '/public/store'))
            })
            .catch(err => res.status(400).json('error :' + err));
    }

    addStoreItem(req.body.storeOldId, req.body.storeName, req.body.storeStatus);

});

router.route('/:storeId').delete((req, res) => {
    Store.findOneAndDelete({
            storeId: String(process.env.STORE_PREFIX + req.params.storeId)
        })
        .then(res.json("Item Deleted")).redirect(String(process.env.ADDRESS + '/public/store'))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/:storeId').patch((req, res) => {
    const newStoreOldId = req.body.storeOldId;
    const newStoreName = req.body.storeName;
    const newStoreStatus = req.body.storeStatus;
    Store.findOneAndUpdate({
            storeId: String(process.env.STORE_PREFIX + req.params.storeId)
        }, {
            storeOldId: newStoreOldId,
            storeName: newStoreName,
            storeStatus: newStoreStatus // TODO front najpierw pobiera dane do formularza Getem po czym ustawia je na domyślne
        })
        .then(storeItem => res.json(storeItem)).redirect(String(process.env.ADDRESS + '/public/store'))
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;