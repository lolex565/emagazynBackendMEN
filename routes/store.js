const router = require("express").Router();
const Store = require("../models/store.model");
const CRUD = require("../functions/crud.js");
const currentModule = Store;
const currentModuleName = "store";
const currentModulePrefix = process.env.STORE_PREFIX;

router.route("/drop").delete((req, res) => {
    CRUD.drop(currentModule, req.body.dropSecret).then((result) =>
        res.json(result)
    );
});

router.route("/add").post((req, res) => {
    CRUD.addItem(
        req.body,
        currentModuleName,
        currentModule,
        currentModulePrefix,
        req.user.name
    ).then((result) =>
        console.log(result));
});

router.route("/delete/:storeId").delete((req, res) => {
    CRUD.deleteItem(
        req.params.storeId,
        currentModuleName,
        currentModule,
        currentModulePrefix
    );
});

router.route("/edit/:storeId").patch((req, res) => {
    CRUD.editItem(
        req.body,
        req.params.storeId,
        currentModuleName,
        currentModule,
        currentModulePrefix
    );
});

module.exports = router;
