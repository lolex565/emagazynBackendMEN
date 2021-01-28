const { array } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    roles: {
        admin: {
            type: Boolean,
        },
        store: {
            type: Boolean,
        },
        archive: {
            type: Boolean,
        },
        library: {
            type: Boolean,
        },
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("User", userSchema);
