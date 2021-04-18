const { string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const libraryRegex = RegExp(process.env.REGEX_LIBRARY);

const librarySchema = new Schema(
    {
        libraryId: {
            type: String,
            required: true,
            unique: true,
            match: libraryRegex,
        },
        libraryOldId: {
            type: String,
            required: false,
        },
        libraryName: {
            type: String,
            required: true,
            minlength: 3,
        },
        libraryStatus: {
            type: String,
            required: false,
        },
        libraryGenre: {
            type: String,
            required: false,
        },
        libraryTarget: {
            type: String,
            required: false,
        },
        libraryBorrowed: {
            type: Boolean,
            required: true,
            default: false,
        },
        libraryBorrower: {
            type: String,
            required: false,
        },
        libraryLocation: {
            type: String,
            required: true,
        },
        ISBN: {
            type: Number,
            maxlength:13,
            minlength: 10,
            required: false,
        },
        public: {
            type: Boolean,
            required: true,
            default: false,
        },
        addedBy: {
            type: String,
        },
        lastEditedBy: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

//TODO Dodać do ksążek numer ISBN

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
