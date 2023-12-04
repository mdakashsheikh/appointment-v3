const mongoose = require('mongoose');

const chamberSc = new mongoose.Schema({
    chamber: {
        type: String,
    },
    address: {
        type: String
    },
    is_active: {
        type: String,
        default: "1",
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('MasterChamber', chamberSc);