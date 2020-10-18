const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const counters = require('./counters');

require('dotenv').config();

counters.exist((status) => {
    if (!status) {
        counters.initialize();
    };
});


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("connected to db");
});

const storeRoutes = require('./routes/store');
const authRoutes = require("./routes/auth");

app.use('/store', storeRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log('server on port: ' + port);
})