const chamberSc = require("../models/chamberSc");

const postChamber = async(req, res) => {

    const chamber = req.body.chamber;
    const address = req.body.address;

    try {
        await chamberSc.create({
            "chamber": chamber,
            "address": address,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editChamber = async(req, res) => {

    const id = req.params.id;
    const chamber = req.body.chamber;
    const address = req.body.address;

    try {
        const oneData = await chamberSc.findByIdAndUpdate(id, {
            "chamber": chamber,
            "address": address,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getChamber = async(req, res) => {

    try {
        const AllData = await chamberSc.find({});
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteChamber = async(req, res) => {
    const id = req.params.id;

    try {
        await chamberSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleChamber = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await chamberSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postChamber,
    editChamber,
    getChamber,
    deleteChamber,
    toggleChamber,
}