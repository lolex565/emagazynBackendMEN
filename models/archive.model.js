const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const archiveRegex = RegExp(process.env.REGEX_ARCHIVE);

const archiveSchema = new Schema({
    archiveId: {
        type: String,
        required: true,
        unique: true,
        match: archiveRegex
    },
    archiveOldId: {
        type: String,
        required: false
    },
    archiveName: {
        type: String,
        required: true,
        minlength: 3
    },
    archiveStatus: {
        type: String,
        required: false,
    },
    addedBy: {
        type: String,
    },
}, {
    timestamps: true,
});

//TODO Dodać do archiwum rok utworzenia, i RODO

const Archive = mongoose.model('Archive', archiveSchema);

module.exports = Archive;