const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    storeId: {
        type: String,
        required: true,
        unique: true,
        match: /[0-9]{5}\/GOR\/MAG/
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
