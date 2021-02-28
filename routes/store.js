const router = require("express").Router();
const Store = require("../models/store.model");
const Counter = require("../models/counter.model");
const currentModule = Store;
const currentModuleName = "Store";


router.route("/drop").delete((req, res) => {
    
    async function drop(module) {
        if (req.body.dropSecret == process.env.DROP_COLLECTION) {
            module.deleteMany({})
                .then(res.json("dropped collection"))
                .catch((err) => res.status(400).json("error :" + err));
        } else {
            res.json("wrong code");
        };
    };
    
    drop(currentModule)
});

router.route("/add").post((req, res) => {
    async function addItem(
        requestBody,
        moduleName
    ) {
        const counter = await Counter.findOne({
            module: moduleName,
        });
        const stamp = String(Number(counter.count + 1)).padStart(5, 0);
        requestBody[moduleName+"Id"] = String(process.env.STORE_PREFIX + stamp);
        const newCount = Number(counter.count + 1);
        requestBody["addedBy"] = req.user.name;
    
        
    
        const newItem = new currentModule(requestBody);
    
        newItem
            .save()
            .then(async () => {
                let doc = await Counter.findOneAndUpdate(
                    {
                        module: moduleName,
                    },
                    {
                        count: newCount,
                    }
                );
                res.json({
                    message: "item added!",
                    success: true,
                    item: requestBody[moduleName+"Name"],
                });
            })
            .catch((err) => res.status(400).json("error :" + err));
    }

    addItem(
        req.body,
        currentModuleName
    );
});

router.route("/delete/:storeId").delete((req, res) => {
    if (req.body.confirmation == true) {
        Store.findOneAndDelete({
            storeId: String(process.env.STORE_PREFIX + req.params.storeId),
        })
            .then((storeItem) => {
                if (!storeItem)
                    res.json({
                        message: "no item to delete!",
                        success: false,
                    });
            })
            .then((storeItem) =>
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
});

router.route("/edit/:storeId").patch((req, res) => {
    let newStoreItem = req.body;
    Store.findOneAndUpdate(
        {
            storeId: String(process.env.STORE_PREFIX + req.params.storeId),
        },
        newStoreItem
    )
        .then((storeItem) =>
            res.json({
                message: "item edited!",
                success: true,
                item: newStoreItem.storeName,
            })
        )
        .catch((err) => res.status(400).json("error: " + err));
});


module.exports = router;
