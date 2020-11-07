const router = require('express').Router();
const Archive = require('../models/archive.model');
const Counter = require('../models/counter.model');

router.route('/').delete((req, res) => {
    if (req.body.dropSecret == process.env.DROP_COLLECTION) {
        Archive.deleteMany({})
            .then(res.json("dropped collection"))
            .catch(err => res.status(400).json('error :' + err));
    } else {
        res.json("wrong code")
    }
});

router.route('/add').post((req, res) => {

    async function addArchiveItem(archiveOldId, archiveName, archiveStatus) {
        const counter = await Counter.findOne({module:"archive"});
        const stamp = String(Number(counter.count+1)).padStart(5, 0);
        const archiveId = String(process.env.ARCHIVE_PREFIX+stamp);
        const newCount = Number(counter.count+1);
        let doc = await Counter.findOneAndUpdate({module:"archive"}, {count: newCount})

        const newItem = new Archive({
            archiveId,
            archiveOldId,
            archiveName,
            archiveStatus,
        });

        newItem.save()
        .then(async () => {
            let doc = await Counter.findOneAndUpdate({module:"archive"}, {count: newCount})
            res.json('item added!')
        })
            .catch(err => res.status(400).json('error :' + err));
    }

    addArchiveItem(req.body.archiveOldId, req.body.archiveName, req.body.archiveStatus);

});

router.route('/:archiveId').delete((req, res) => {
    Archive.findOneAndDelete({
            archiveId: String(process.env.ARCHIVE_PREFIX + req.params.archiveId)
        })
        .then(res.json("Item Deleted"))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/:archiveId').patch((req, res) => {
    const newArchiveOldId = req.body.archiveOldId;
    const newArchiveName = req.body.archiveName;
    const newArchiveStatus = req.body.archiveStatus;
    Archive.findOneAndUpdate({
            archiveId: String(process.env.ARCHIVE_PREFIX + req.params.archiveId)
        }, {
            archiveOldId: newArchiveOldId,
            archiveName: newArchiveName,
            archiveStatus: newArchiveStatus // TODO front najpierw pobiera dane do formularza Getem po czym ustawia je na domyślne
        })
        .then(archiveItem => res.json(archiveItem))
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;