const router = require("express").Router();
const Store = require("../models/store.model");
const Counter = require("../models/counter.model");

router.route("/drop").delete((req, res) => {
    if (req.body.dropSecret == process.env.DROP_COLLECTION) {
        Store.deleteMany({})
            .then(res.json("dropped collection"))
            .catch((err) => res.status(400).json("error :" + err));
    } else {
        res.json("wrong code");
    }
});

router.route("/add").post((req, res) => {
    async function addItem(
        requestBody,
        module
    ) {
        const counter = await Counter.findOne({
            module: module,
        });
        const stamp = String(Number(counter.count + 1)).padStart(5, 0);
        requestBody[module+"Id"] = String(process.env.STORE_PREFIX + stamp);
        const newCount = Number(counter.count + 1);
        requestBody["addedBy"] = req.user.name;
    
        
    
        const newItem = new Store(requestBody);
    
        newItem
            .save()
            .then(async () => {
                let doc = await Counter.findOneAndUpdate(
                    {
                        module: module,
                    },
                    {
                        count: newCount,
                    }
                );
                res.json({
                    message: "item added!",
                    success: true,
                    item: requestBody[module+"Name"],
                });
            })
            .catch((err) => res.status(400).json("error :" + err));
    }

    addItem(
        req.body,
        "store"
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

//TODO przepisać takiego edita na inne endpointy

module.exports = router;
