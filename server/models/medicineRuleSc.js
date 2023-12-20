const mongoose = require('mongoose');

const medicineRuleSc = new mongoose.Schema({
    m_rule: {
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
        default: Date.now,
    }
})

module.exports = mongoose.model('medicine_rule', medicineRuleSc);