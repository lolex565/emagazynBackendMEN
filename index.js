const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const counters = require("./counters");

require("dotenv").config();

counters.exist((status) => {
    if (!status) {
        counters.initialize();
    }
});

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("connected to db");
});

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
    console.log("server on port: " + port);
});
