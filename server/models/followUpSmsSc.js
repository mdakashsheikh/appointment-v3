const mongoose = require('mongoose');

const followUpSmsSc = new mongoose.Schema({
    patient_id: {
        type: String,
    },
    phone: {
        type: String,
    },
    status: {
        type: String
    }
})

module.exports = mongoose.model("folloStatusSc", followUpSmsSc);