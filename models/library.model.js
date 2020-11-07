const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const libraryRegex = RegExp(process.env.REGEX_LIBRARY);

const librarySchema = new Schema({
    libraryId: {
        type: String,
        required: true,
        unique: true,
        match: libraryRegex
    },
    libraryOldId: {
        type: String,
        required: false
    },
    libraryName: {
        type: String,
        required: true,
        minlength: 3
    },
    libraryStatus: {
        type: String,
        required: false,

    },
}, {
    timestamps: true,
});

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;