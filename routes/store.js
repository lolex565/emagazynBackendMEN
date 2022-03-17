const router = require("express").Router();
const Store = require("../models/store.model");
const CRUD = require("../functions/crud.js");
const { date } = require("joi");
const currentModule = Store;
const currentModuleName = "store";
const currentModulePrefix = process.env.STORE_PREFIX;
const PDFDocument = require('pdfkit');

router.route("/get").get((req, res) => {
    CRUD.getAll(currentModuleName, currentModule, "", false, req.user.roles)
        .then((storeItems) => res.status(200).json(storeItems))
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
        .then((storeItems) => res.status(200).json(storeItems))
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

router.route("/delete/:storeId").delete((req, res) => {
    CRUD.deleteItem(
        req.params.storeId,
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

router.route("/edit/:storeId").patch((req, res) => {
    CRUD.editItem(
        req.body,
        req.params.storeId,
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

function convertDate(date) {
    var d = new Date(date),
        month = (String(d.getMonth() + 1)).padStart(2, "0"),
        day = (String(d.getDate())).padStart(2, "0"),
        year = d.getFullYear();
        return String(day + "-" + month + "-" + year);
}; //!tymczasowo tu, potem przenieść do funkcji w module

router.route("/pdfraport").get((req, res) => {
    CRUD.getAll(currentModuleName, currentModule, "", false, req.user.roles)
        .then((storeItems) => {
            const pdf = new PDFDocument();
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=raport.pdf"
            );
            pdf.pipe(res);
            pdf.registerFont('Roboto', './fonts/Roboto-Regular.ttf');
            pdf.font('Roboto');
            pdf.fontSize(25).text("Raport");
            pdf.moveDown();
            pdf.fontSize(15).text("Data: " + new Date());
            pdf.moveDown();
            pdf.fontSize(15).text("Raport z danymi: ");
            pdf.moveDown();
            storeItems.forEach((item) => {
                //console.log(item);
                pdf.fontSize(18).text(item.storeName);
                pdf.moveDown();
                pdf.fontSize(15).text("Cena: " + item.storeValue);
                pdf.moveDown();
                if (item.status != undefined) {
                pdf.fontSize(15).text("Opis: " + item.status);
                } else {
                    pdf.fontSize(15).text("Opis: ---");
                }
                pdf.moveDown();
                pdf.fontSize(15).text("Lokalizacja: " + item.storeLocation);
                pdf.moveDown();
                pdf.fontSize(15).text("Ilość: " + item.storeAmount);
                pdf.moveDown();
                pdf.fontSize(15).text("Data dodania: " + convertDate(Date(item.createdAt)));
                pdf.moveDown();
                pdf.fontSize(15).text("Data modyfikacji: " + convertDate(Date(item.updatedAt)));
                pdf.moveDown();
            });
            //end pdf file 
            pdf.end();

        })
        .catch((err) => res.status(500).json("error: " + err));
});


module.exports = router;
