const mongoose = require('mongoose');

const timeSc = new mongoose.Schema({
    st_time: {
        type: String
    },
    en_time: {
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

module.exports = mongoose.model('MasterTime', timeSc);