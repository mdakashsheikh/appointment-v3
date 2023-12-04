const mongoose = require('mongoose');

const masterSc = new mongoose.Schema({
    chamber: {
        type: Array,
    },
    specialist: {
        type: Array,
    },
    dr_name: {
        type: Array,
    },
    s_time: {
        type: Array,
    }

})

module.exports = mongoose.model('MasterData', masterSc);

