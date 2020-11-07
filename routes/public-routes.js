const router = require('express').Router();
const Archive = require('../models/archive.model');
const Library = require('../models/library.model');
const Store = require('../models/store.model');

router.route('/store').get((req, res) => {
    Store.find()
        .then(storeItems => res.json(storeItems))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/store/:storeId').get((req, res) => {
    Store.findOne({
            storeId: String(process.env.STORE_PREFIX + req.params.storeId)
        })
        .then(storeItem => res.json(storeItem))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/library').get((req, res) => {
    Library.find()
        .then(libraryItems => res.json(libraryItems))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/library/:libraryId').get((req, res) => {
    Library.findOne({
            libraryId: String(process.env.LIBRARY_PREFIX + req.params.libraryId)
        })
        .then(libraryItem => res.json(libraryItem))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/archive').get((req, res) => {
    Archive.find()
        .then(archiveItems => res.json(archiveItems))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/archive/:archiveId').get((req, res) => {
    Archive.findOne({
            archiveId: String(process.env.ARCHIVE_PREFIX + req.params.archiveId)
        })
        .then(archiveItem => res.json(archiveItem))
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;