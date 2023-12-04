const smsSc = require("../models/smsSc");

const postSMS = async(req, res) => {
    const title = req.body.title;
    const sms1 = req.body.sms1;

    try {
        await smsSc.create({
            "title": title,
            'sms1': sms1
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editSMS = async(req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const sms1 = req.body.sms1;

    try {
        const oneData = await smsSc.findByIdAndUpdate(id, {
            "title": title,
            "sms1": sms1,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getSMS = async(req, res) => {

    try {
        const AllData = await smsSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteSMS = async(req, res) => {
    const id = req.params.id;

    try {
        await smsSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postSMS,
    editSMS,
    getSMS,
    deleteSMS,
}