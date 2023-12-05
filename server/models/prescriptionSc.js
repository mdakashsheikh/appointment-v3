const mongoose = require('mongoose');

const prescriptionSc = new mongoose.Schema({
    medicineTime: {
        type: String,
    },
    medicineTiming: {
        type: String,
    },
    medicineLimite: {
        type: String,
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

module.exports = mongoose.model('prescription_sc', prescriptionSc);