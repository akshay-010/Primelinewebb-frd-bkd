const mongoose = require('mongoose');

const coverPicSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    subheading: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CoverPic", coverPicSchema);