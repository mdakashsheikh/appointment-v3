const mongoose = require('mongoose');

const medicineSc = new mongoose.Schema({
    medicine_name: {
        type: String,
    }
})

module.exports = mongoose.model('medicine_sc', medicineSc);