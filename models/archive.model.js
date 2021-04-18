const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const archiveRegex = RegExp(process.env.REGEX_ARCHIVE);

const archiveSchema = new Schema(
    {
        archiveId: {
            type: String,
            required: true,
            unique: true,
            match: archiveRegex,
        },
        archiveOldId: {
            type: String,
            required: false,
        },
        archiveName: {
            type: String,
            required: true,
            minlength: 3,
        },
        yearOfCreation: {
            type: String,
            required: true,
            default: "nieznany",
        },
        archiveStatus: {
            type: String,
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

const Archive = mongoose.model("Archive", archiveSchema);

module.exports = Archive;
