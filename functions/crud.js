const Counter = require("../models/counter.model");

async function drop(module, dropSecret) {
    if (dropSecret == process.env.DROP_COLLECTION) {
        let res = {};
        let result = await module.deleteMany({});
        if (result.ok) {
            res.status = "dropped";
            return res;
        }
    } else {
        res.status = "not dropped";
        return res;
    }
}

/* async function addItem(
    requestBody,
    usedModuleName,
    usedModule,
    usedPrefix,
    user
) {
    let res = {};
    const counter = await Counter.findOne({
        module: usedModuleName,
    });
    const stamp = String(Number(counter.count + 1)).padStart(5, 0);
    requestBody[usedModuleName + "Id"] = String(usedPrefix + stamp);
    const newCount = Number(counter.count + 1);
    requestBody["addedBy"] = user;

    const newItem = new usedModule(requestBody);
    let result = await newItem
        .save()
        .then(async () => {
            let doc = await Counter.findOneAndUpdate(
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
        })
        .catch((err) => (res.error = err));

        if (result) {
            return res;
        }
} */

async function addItem(
    requestBody,
    usedModuleName,
    usedModule,
    usedPrefix,
    user
) {
    let res = {};
    const counter = await Counter.findOne({
        module: usedModuleName,
    });
    const stamp = String(Number(counter.count + 1)).padStart(5, 0);
    requestBody[usedModuleName + "Id"] = String(usedPrefix + stamp);
    const newCount = Number(counter.count + 1);
    requestBody["addedBy"] = user;

    const newItem = new usedModule(requestBody);
    let result = await newItem.save(async function (err, doc) {
        if (err) return err;
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
        /* return res; */
    });
    console.log(result); //TODO naprawić chrzanione save tak żeby zwracalo cokolwiek innego niż undefined
}


async function deleteItem(
    requestParam,
    usedModuleName,
    usedModule,
    usedPrefix
) {
    if (req.body.confirmation == true) {
        let filter = {};
        filter[usedModuleName + "Id"] = String(usedPrefix + requestParam);
        usedModule
            .findOneAndDelete(filter)
            .then((Item) => {
                if (!Item)
                    res.json({
                        message: "no item to delete!",
                        success: false,
                    });
            })
            .then((Item) =>
                res.json({
                    message: "Item Deleted",
                    success: true,
                })
            )
            .catch((err) => res.status(400).json("error: " + err));
    } else {
        res.json({
            message: "deletion not confirmed",
        });
    }
}

async function editItem(
    requestBody,
    requestParam,
    usedModuleName,
    usedModule,
    usedPrefix
) {
    let filter = {};
    filter[usedModuleName + "Id"] = String(usedPrefix + requestParam);
    usedModule
        .findOneAndUpdate(filter, requestBody)
        .then((Item) =>
            res.json({
                message: "item edited!",
                success: true,
                item: Item[usedModuleName + "Name"],
            })
        )
        .catch((err) => res.status(400).json("error: " + err));
}

exports.drop = drop;
exports.addItem = addItem;
exports.deleteItem = deleteItem;
exports.editItem = editItem;
