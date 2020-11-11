const router = require('express').Router();
const Library = require('../models/library.model');
const Counter = require('../models/counter.model');

router.route('/drop').delete((req, res) => {
    if (req.body.dropSecret == process.env.DROP_COLLECTION) {
        Library.deleteMany({})
            .then(res.json("dropped collection"))
            .catch(err => res.status(400).json('error :' + err));
    } else {
        res.json("wrong code")
    }
});

router.route('/add').post((req, res) => {

    async function addLibraryItem(libraryOldId, libraryName, libraryStatus) {
        const counter = await Counter.findOne({module:"library"});
        const stamp = String(Number(counter.count+1)).padStart(5, 0);
        const libraryId = String(process.env.LIBRARY_PREFIX+stamp);
        const newCount = Number(counter.count+1);

        const newItem = new Library({
            libraryId,
            libraryOldId,
            libraryName,
            libraryStatus,
        });

        newItem.save()
            .then(async () => {
                let doc = await Counter.findOneAndUpdate({module:"library"}, {count: newCount})
                res.json({message:'item added!', success: true, item: libraryName})
            })
            .catch(err => res.status(400).json('error :' + err));
    }

    addLibraryItem(req.body.libraryOldId, req.body.libraryName, req.body.libraryStatus);

});

router.route('/delete/:libraryId').delete((req, res) => {
    if (req.body.confirmation == true) {
        Library.findOneAndDelete({
                libraryId: String(process.env.LIBRARY_PREFIX + req.params.libraryId)
            })
            .then(libraryItem => {if (!libraryItem) res.json({message:'no item to delete!', success: false})})
            .then(libraryItem => res.json({message:"Item Deleted", success: true}))
            .catch(err => res.status(400).json('error: ' + err));
    } else {
        res.json({message: "deletion not confirmed"})
    };
});

router.route('/edit/:libraryId').patch((req, res) => {
    const newLibraryOldId = req.body.libraryOldId;
    const newLibraryName = req.body.libraryName;
    const newLibraryStatus = req.body.libraryStatus;
    Library.findOneAndUpdate({
            libraryId: String(process.env.LIBRARY_PREFIX + req.params.libraryId)
        }, {
            libraryOldId: newLibraryOldId,
            libraryName: newLibraryName,
            libraryStatus: newLibraryStatus // TODO front najpierw pobiera dane do formularza Getem po czym ustawia je na domyślne
        })
        .then(libraryItem => {if (!libraryItem) res.json({message:'no item to edit!', success: false})})
        .then(libraryItem => res.json({message:'item edited!', success: true, item: newLibraryName}))
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;