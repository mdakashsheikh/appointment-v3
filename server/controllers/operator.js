const operatorSc = require("../models/operatorSc");

const postOperator = async(req, res) => {
    const name = req.body.name;
    const userName = req.body.userName;
    const phone = req.body.phone;
    const password = req.body.password;
    const dr_name = req.body.dr_name;

    try {
        await operatorSc.create({
            "name": name,
            "userName": userName,
            "phone": phone,
            "password": password,
            "dr_name": dr_name,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editOperator = async(req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const userName = req.body.userName;
    const phone = req.body.phone;
    const password = req.body.password;
    const dr_name = req.body.dr_name;

    try {
        const oneData = await operatorSc.findByIdAndUpdate(id, {
            "name": name,
            "userName": userName,
            "phone": phone,
            "password": password,
            "dr_name": dr_name,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getOperator = async(req, res) => {

    try {
        const AllData = await operatorSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteOperator = async(req, res) => {
    const id = req.params.id;

    try {
        await operatorSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleOperator = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await operatorSc.findByIdAndUpdate(id, {
            "is_active": is_active
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postOperator,
    editOperator,
    getOperator,
    deleteOperator,
    toggleOperator
}