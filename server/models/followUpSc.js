const mongoose = require('mongoose');

const followUpSc = new mongoose.Schema({
    chamber: {
        type: String,
    },
    specialist: {
        type: String,
    },
    doctor: {
        type: String,
    },
    date1: {
        type: String,
    },
    time1: {
        type: Array,
    },
    name: {
        type: String,
    },
    phone: {
        type: String
    },
    serial: {
        type: String,
    },
    patient_id: {
        type: String,
    },
    visit_status: {
        type: Boolean,
    },
    price: {
        type: String,
    },
    followUpDate: {
        type: String,
    },
    visit_time: {
        type: Array,
    },
    image: {
        type: Array,
    },
    is_active: {
        type: String,
        default: "Not Sent",
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('followsc', followUpSc);