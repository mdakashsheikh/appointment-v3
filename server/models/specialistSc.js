const mongoose = require('mongoose');

const specialistSc = new mongoose.Schema({
    specialist: {
        type: String
    },
    details: {
        type: String
    },
    is_active: {
        type: String,
        default: "1",
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("MasterSpecialist", specialistSc);