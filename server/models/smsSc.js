const mongoose = require('mongoose');

const smsSc = new mongoose.Schema({
    title: {
        type: String,
    },
    sms1: {
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('sms', smsSc);