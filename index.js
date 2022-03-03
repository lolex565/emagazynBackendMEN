//!importowanie bibliotek

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const counters = require("./counters");
const errorHandler = require("./functions/errorHandler");

//!uruchomienie aplikacji

const main = async () => {
    require("dotenv").config(); //!ładowanie konfiguracji ze zmiennych środowiskowych/pliku .env

    counters.exist((status) => {
        if (!status) {
            counters.initialize(); //!inicjalizacja licznika jeżeli nie istnieje
        }
    });

    const app = express(); //!tworzenie aplikacji
    const port = process.env.PORT; //!port na którym ma działać aplikacja

    app.use(cors()); //?obsługa CORS?
    app.use(express.json());   //!obsługa JSON

    const uri = process.env.MONGO_URI; //!adres bazy danych

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });     //!połączenie z bazą danych

    const connection = mongoose.connection;  //!obiekt połączenia z bazą danych

    connection.once("open", () => {
        console.log("connected to db");
    }); //!połączenie z bazą danych

    //!import routingu

    const storeRoutes = require("./routes/store");
    const libraryRoutes = require("./routes/library");
    const archiveRoutes = require("./routes/archive");
    const authRoutes = require("./routes/auth");
    const adminRoutes = require("./routes/admin");
    const verifyToken = require("./functions/verifyToken");
    const publicRoutes = require("./routes/public-routes");
    const userRoutes = require("./routes/user");
    const accountVerificationRoute = require("./routes/accountverification");
    const renewRoute = require("./routes/renew.js");
    //TODO przywracanie hasła

    //!montowanie routingu na /

    app.use("/public", publicRoutes);
    app.use("/store", verifyToken("store"), storeRoutes); 
    app.use("/library", verifyToken("library"), libraryRoutes); 
    app.use("/archive", verifyToken("archive"), archiveRoutes);
    app.use("/admin", verifyToken("admin"), adminRoutes);
    app.use("/auth", authRoutes);
    app.use("/user", verifyToken(""), userRoutes);
    app.use("/verify", accountVerificationRoute);
    app.use("/renew", verifyToken(""), renewRoute);

    app.listen(port, () => {
        console.log("server on port: " + port); //!uruchomienie nasłuchiwania na porcie
    });
};

try {
    main();
} catch (err) {
    errorHandler.saveErrorLog(err);
} //!error handling

//TODO Przepisz lączenie z bazą danych na funkcje
//TODO Opracuj zwijanie duplikatów przedmiotów(np kilka namiotów w zwijane)
//TODO Generowanie raportów do excela i PDF 
//TODO przepiszfrontend na coś ludzkiego (svelte/react)