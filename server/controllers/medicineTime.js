const medicineTimeSc = require("../models/medicineTimeSc");

const postMTime = async(req, res) => {
    const m_time = req.body.m_time;
    const details = req.body.details;

    try {
        await medicineTimeSc.create({
            'm_time': m_time,
            'details': details,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editMTime = async(req, res) => {
    const id = req.params.id;
    const m_time = req.body.m_time;
    const details = req.body.details;

    try {
        const oneData = await medicineTimeSc.findByIdAndUpdate(id, {
            'm_time': m_time,
            'details': details
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getMTime = async(req, res) => {

    try {
        const AllData = await medicineTimeSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteMTime = async(req, res) => {
    const id = req.params.id;

    try {
        await medicineTimeSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleMTime = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await medicineTimeSc.findByIdAndUpdate(id, {
            'is_active': is_active,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postMTime,
    editMTime,
    getMTime,
    deleteMTime,
    toggleMTime,
}