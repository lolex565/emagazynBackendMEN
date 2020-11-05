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
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("connected to db");
});

const storeRoutes = require('./routes/store');
const authRoutes = require('./routes/auth'); 
const adminRoutes = require('./routes/admin');
const verifyToken = require('./routes/token_validators/validate-token');
const verifyStoreToken = require('./routes/token_validators/validate-store-token');
const verifyAdminToken = require('./routes/token_validators/validate-admin-token');
const publicStoreRoutes = require('./routes/public-store-routes');
const userRoutes = require('./routes/user');
const accountVerificationRoute = require('./routes/accountverification');
const renewRoute = require('./routes/renew.js');
//TODO przywracanie hasła

app.use('/public/store', publicStoreRoutes);
app.use('/store', verifyStoreToken, storeRoutes);
app.use('/admin', verifyAdminToken, adminRoutes);
app.use('/auth', authRoutes);
app.use('/user', verifyToken, userRoutes);
app.use('/verify',accountVerificationRoute);
app.use('/renew', verifyToken, renewRoute);

app.listen(port, () => {
    console.log('server on port: ' + port);
})