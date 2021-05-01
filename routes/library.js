const router = require("express").Router();
const Library = require("../models/library.model");
const CRUD = require("../functions/crud.js");
const { date } = require("joi");
const currentModule = Library;
const currentModuleName = "library";
const currentModulePrefix = process.env.LIBRARY_PREFIX;

router.route("/get").get((req, res) => {
    CRUD.getAll(currentModuleName, currentModule, "", false, req.user.roles)
        .then((libraryItems) => res.status(200).json(libraryItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/get/:id").get((req, res) => {
    CRUD.getOne(
        currentModuleName,
        currentModule,
        currentModulePrefix,
        req.params.id,
        "",
        false,
        req.user.roles
    )
        .then((libraryItems) => res.status(200).json(libraryItems))
        .catch((err) => res.status(500).json("error: " + err));
});

router.route("/drop").delete((req, res) => {
    CRUD.drop(currentModule, req.body.dropSecret).then(async (data) => {
        if (data.success) {
            res.status(200).json(data);
        } else {
            res.status(500).json(data);
        }
    });
});

router.route("/add").post(async (req, res) => {
    CRUD.addItem(
        req.body,
        currentModuleName,
        currentModule,
        currentModulePrefix,
        req.user.name
    ).then(async (data) => {
        if (data.success === true) {
            res.status(200).json(data);
        } else {
            res.status(500).json(data);
        }
    });
});

router.route("/delete/:libraryId").delete((req, res) => {
    CRUD.deleteItem(
        req.params.libraryId,
        req.body.confirmation,
        currentModuleName,
        currentModule,
        currentModulePrefix
    ).then(async (data) => {
        if (data.success) {
            res.status(200).json(data);
        } else {
            res.status(500).json(data);
        }
    });
});

router.route("/edit/:libraryId").patch((req, res) => {
    CRUD.editItem(
        req.body,
        req.params.libraryId,
        currentModuleName,
        currentModule,
        currentModulePrefix,
        req.user.name
    ).then(async (data) => {
        if (data.success) {
            res.status(200).json(data);
        } else {
            res.status(500).json(data);
        }
    });
});

module.exports = router;
