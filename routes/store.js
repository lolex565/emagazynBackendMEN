
const router = require('express').Router();
let Store = require('../models/store.model');

router.route('/').get((req, res) => {
    Store.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('error: '+ err));
});

router.route('/').delete((req, res) => {
    if (req.body.dropSecret == process.env.DROP_COLLECTION) {
        Store.deleteMany({})
            .then(res.json("dropped collection"))
            .catch(err => res.status(400).json('error :' + err));
        
    } else {
        res.json("wrong code")
    }
});

router.route('/add').post((req, res) => {
    
    var counter;

    Store.countDocuments({},function (err, count) {
        if (err) {
            res.status(400).json('error :' + err);
        };
        counter = String(Number(count) + 1).padStart(5, 0);
        //counter = counter.padStart(5, 0);

        const storeId = String(process.env.STORE_PREFIX + counter);
        const storeOldId = req.body.storeOldId;
        const storeName = req.body.storeName;
        const storeStatus = req.body.storeStatus;

        const newItem = new Store({
            storeId,
            storeOldId,
            storeName,
            storeStatus,
        });

        newItem.save()
            .then(() => res.json('item added!'))
            .catch(err => res.status(400).json('error :' + err));
        });
});

router.route('/:storeId').get((req, res) => {
    Store.findOne({storeId: String(process.env.STORE_PREFIX + req.params.storeId)})
        .then(storeItem => res.json(storeItem))
        .catch(err => res.status(400).json('error: '+ err));
});

router.route('/:storeId').delete((req, res) => {
    Store.findOneAndDelete({storeId: String(process.env.STORE_PREFIX + req.params.storeId)})
    .then(res.json("Item Deleted"))
    .catch(err => res.status(400).json('error: '+ err));
});

router.route('/update/:storeId').patch((req, res) => {
    const newStoreOldId = req.body.storeOldId;
    const newStoreName = req.body.storeName;
    const newStoreStatus = req.body.storeStatus;
    console.log(newStoreId);
    Store.findOneAndUpdate({storeId:req.params.storeId}, {
            storeOldId: newStoreOldId,
            storeName: newStoreName,
            storeStatus: newStoreStatus // TODO front najpierw pobiera dane do formularza Getem po czym ustawia je na domyślne
    })
        .then(storeItem => res.json(storeItem))   
        .catch(err => res.status(400).json('error: '+ err));
});

module.exports = router;