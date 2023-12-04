const timeSc = require("../models/timeSc");

const postTime = async(req, res) => {
    const st_time = req.body.st_time;
    const en_time = req.body.en_time;

    try {
        await timeSc.create({
            "st_time": st_time,
            "en_time": en_time,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editTime = async(req, res) => {
    const id = req.params.id;
    const st_time = req.body.st_time;
    const en_time = req.body.en_time;

    try {
        const oneData = await timeSc.findByIdAndUpdate(id, {
            "st_time": st_time,
            "en_time": en_time,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err)
    }
}

const getTime = async(req, res) => {

    try {
        const AllData = await timeSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteTime = async(req, res) => {
    const id = req.params.id;

    try {
        await timeSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleTime = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await timeSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postTime,
    editTime,
    getTime,
    deleteTime,
    toggleTime,
}