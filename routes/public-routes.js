const router = require("express").Router();
const Archive = require("../models/archive.model");
const Library = require("../models/library.model");
const Store = require("../models/store.model");
const CRUD = require("../functions/crud.js");

router.route("/store").get((req, res) => {
    CRUD.getAll(
        "store",
        Store,
        "storeId storeOldId storeName storeStatus storeAmount",
        true
    )
        .then((storeItems) => res.status(200).json(storeItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/store/:storeId").get((req, res) => {
    CRUD.getOne(
        "store",
        Store,
        process.env.STORE_PREFIX,
        req.params.storeId,
        "storeId storeOldId storeName storeStatus storeAmount",
        true
    )
        .then((storeItems) => res.status(200).json(storeItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/library").get((req, res) => {
    CRUD.getAll(
        "library",
        Library,
        "libraryId libraryOldId libraryName libraryStatus ISBN libraryGenre libraryTarget libraryBorrowed",
        true
    )
        .then((libraryItems) => res.status(200).json(libraryItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/library/:libraryId").get((req, res) => {
    CRUD.getOne(
        "store",
        Store,
        process.env.LIBRARY_PREFIX,
        req.params.libraryId,
        "libraryId libraryOldId libraryName libraryStatus ISBN libraryGenre libraryTarget libraryBorrowed",
        true
    )
        .then((storeItems) => res.status(200).json(storeItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/archive").get((req, res) => {
    CRUD.getAll(
        "archive",
        Archive,
        "archiveId archiveOldId archiveName archiveStatus yearOfCreation",
        true
    )
        .then((archiveItems) => res.status(200).json(archiveItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/archive/:archiveId").get((req, res) => {
    CRUD.getOne(
        "archive",
        Archive,
        process.env.ARCHIVE_PREFIX,
        req.params.archiveId,
        "archiveId archiveOldId archiveName archiveStatus yearOfCreation",
        true
    )
        .then((archiveItems) => res.status(200).json(archiveItems))
        .catch((err) => res.status(500).json("error: " + err));
});
module.exports = router;
