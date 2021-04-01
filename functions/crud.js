const Counter = require("../models/counter.model");
const errorHandler = require("./errorHandler.js");

const drop = async (module, dropSecret, usedModuleName) => {
    return new Promise(async (resolve) => {
        if (dropSecret == process.env.DROP_COLLECTION) {
            let res = {};
            let result = await module.deleteMany({}, async (err, doc) => {
                if (err) {
                    errorHandler.saveErrorLog(usedModuleName, err);
                    res.status = "not dropped";
                    res.success = false;
                    resolve(res);
                } else {
                    res.status = "dropped";
                    res.success = true;
                    resolve(res);
                }
            });
        } else {
            res.status = "not dropped";
            res.success = false;
            resolve(res);
        }
    });
};

const addItem = async (
    requestBody,
    usedModuleName,
    usedModule,
    usedPrefix,
    user
) => {
    return new Promise(async (resolve) => {
        let res = {};
        const counter = await Counter.findOne({
            module: usedModuleName,
        });
        const stamp = String(Number(counter.count + 1)).padStart(5, 0);
        requestBody[usedModuleName + "Id"] = String(usedPrefix + stamp);
        const newCount = Number(counter.count + 1);
        requestBody["addedBy"] = user;

        const newItem = await new usedModule(requestBody);
        let result = await newItem.save(async function (err, doc) {
            if (err) {
                errorHandler.saveErrorLog(usedModuleName, err);
                res.success = false;
                resolve(res);
            } else {
                let conterDoc = await Counter.findOneAndUpdate(
                    {
                        module: usedModuleName,
                    },
                    {
                        count: newCount,
                    }
                );
                res.message = "item added!";
                res.success = true;
                res.item = requestBody[usedModuleName + "Name"];
                resolve(res);
            }
        });
    });
};

const deleteItem = async (
    requestParam,
    confirmation,
    usedModuleName,
    usedModule,
    usedPrefix
) => {
    return new Promise(async (resolve) => {
        let res = {};
        if (confirmation == true) {
            let filter = {};
            filter[usedModuleName + "Id"] = String(usedPrefix + requestParam);
            usedModule
                .findOneAndDelete(filter)
                .then((Item) => {
                    if (!Item) {
                        res.message = "no item to delete!";
                        res.success = false;
                        resolve(res);
                    }
                })
                .then((Item) => {
                    res.message = "Item Deleted";
                    res.success = true;
                    resolve(res);
                })
                .catch((err) => {
                    errorHandler.saveErrorLog(usedModuleName, err);
                    res.success = false;
                    resolve(res);
                });
        } else {
            res.message = "deletion not confirmed";
            res.success = false;
            res.conf = false;
            resolve(res);
        }
    });
};

const editItem = async (
    requestBody,
    requestParam,
    usedModuleName,
    usedModule,
    usedPrefix,
    user
) => {
    return new Promise(async (resolve) => {
        let res = {};
        let filter = {};
        requestBody.lastEditedBy = user;
        filter[usedModuleName + "Id"] = String(usedPrefix + requestParam);
        usedModule
            .findOneAndUpdate(filter, requestBody)
            .then((Item) => {
                if (Item) {
                    res.message = "item edited!";
                    res.success = true;
                    res.item = Item[usedModuleName + "Name"];
                    resolve(res);
                } else {
                    res.success = false;
                    res.message = "something went wrong";
                    resolve(res);
                }
            })
            .catch((err) => {
                errorHandler.saveErrorLog(usedModuleName, err);
                res.success = false;
                resolve(res);
            });
    });
};

module.exports.drop = drop;
module.exports.addItem = addItem;
module.exports.deleteItem = deleteItem;
module.exports.editItem = editItem;
