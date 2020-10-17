const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeRegex = RegExp(process.env.REGEX_STORE);

const storeSchema = new Schema({
    storeId: {
        type: String,
        required: true,
        unique: true,
        match: storeRegex
    },
    storeOldId: {
        type: String,
        required: false
    },
    storeName: {
        type: String,
        required: true,
        minlength: 3
    },
    storeStatus: {
        type: String,
        required: false,
        
    },
}, {
    timestamps: true,
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
