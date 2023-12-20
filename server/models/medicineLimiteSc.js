const mongoose = require('mongoose');

const medicineLimiteSc = new mongoose.Schema({
    medicine_limite: {
        type: String
    },
    details: {
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

module.exports = mongoose.model('medicine_limite', medicineLimiteSc);