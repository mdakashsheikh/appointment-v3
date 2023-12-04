const specialistSc = require("../models/specialistSc");

const postSpecial = async(req, res) => {
    const specialist = req.body.specialist;
    const details = req.body.details;

    try {
        await specialistSc.create({
            "specialist": specialist,
            "details": details,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editSpecial = async(req, res) => {
    const id = req.params.id;
    const specialist = req.body.specialist;
    const details = req.body.details;

    try {
        const oneData = await specialistSc.findByIdAndUpdate(id, {
            "specialist": specialist,
            "details": details,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getSpecial = async(req, res) => {

    try {
        const AllData = await specialistSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteSpecial = async(req, res) => {
    const id = req.params.id;

    try {
        await specialistSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleSpecial = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await specialistSc.findByIdAndUpdate(id, {
            "is_active": is_active
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postSpecial,
    editSpecial,
    getSpecial,
    deleteSpecial,
    toggleSpecial
}