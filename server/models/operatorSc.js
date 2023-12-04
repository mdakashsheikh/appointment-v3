const mongoose = require('mongoose');

const operatorSc = new mongoose.Schema({
    name: {
        type: String,
    },
    userName: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    dr_name: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("operator", operatorSc)