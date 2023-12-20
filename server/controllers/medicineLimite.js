const medicineLimiteSc = require("../models/medicineLimiteSc");

const postLimite = async(req, res) => {

    const medicine_limite = req.body.medicine_limite;
    const details = req.body.details;

    try {
        await medicineLimiteSc.create({
            'medicine_limite': medicine_limite,
            'details': details
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editLimite = async(req, res) => {

    const id = req.params.id;
    const medicine_limite = req.body.medicine_limite;
    const details = req.body.details;

    try {
        const oneData = await medicineLimiteSc.findByIdAndUpdate(id, {
            'medicine_limite': medicine_limite,
            'details': details
        })
        res.send(oneData);

    } catch ( err ) {
        res.status(400).send(err);
    }
}

const getLimite = async(req, res) => {

    try {
        const AllData = await medicineLimiteSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteLimite = async(req, res) => {
    const id = req.params.id;

    try {
        await medicineLimiteSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleLimite = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await medicineLimiteSc.findByIdAndUpdate(id, {
            'is_active': is_active,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}
 
module.exports = {
    postLimite,
    editLimite,
    getLimite,
    deleteLimite,
    toggleLimite,
}