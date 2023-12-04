const mongoose = require('mongoose');

const doctorSc = new mongoose.Schema({
    name: {
        type: String,
    },
    specialist: {
        type: String,
    },
    designation: {
        type: String,
    },
    degree: {
        type: String,
    },
    experience: {
        type: String,
    },
    is_active: {
        type: String,
        default: "1",
    },
    date :{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("MasterDoctor", doctorSc);