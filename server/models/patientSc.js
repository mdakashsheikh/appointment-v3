const mongoose = require('mongoose');

const patientSc = new mongoose.Schema({
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
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    phone: {
        type: String
    },
    details: {
        type: String
    },
    serial: {
        type: Number,
    },
    status: {
        type: String,
    },
    visit_status: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('PatientData', patientSc);