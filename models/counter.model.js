const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const counterSchema = new Schema({
    module: {
        type: String,
        unique: true,
    },
    count: {
        type: Number,
    },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
