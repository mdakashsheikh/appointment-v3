const mongoose = require('mongoose');

const medicineTimeSc = new mongoose.Schema({
    m_time: {
        type: String,
    },
    details: {
        type: String,
    },
    is_active: {
        type: String,
        default: '1',
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('medicine_Time', medicineTimeSc);