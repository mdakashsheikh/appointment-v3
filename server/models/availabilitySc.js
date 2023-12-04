const mongoose = require('mongoose');

const availabilitySc = new mongoose.Schema({
    dname:{
        type: String
    },
    chamber: {
        type: String
    },
    days1: {
        type: Array
    },
    saturdayT:{
        type: Array
    },
    sundayT:{
        type: Array
    },
    mondayT:{
        type: Array
    },
    tuesdayT:{
        type: Array
    },
    wednesdayT:{
        type: Array
    },
    thursdayT:{
        type: Array
    },
    fridayT:{
        type: Array
    },
    serial: {
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

module.exports = mongoose.model('MasterAvailability', availabilitySc)