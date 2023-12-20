const medicineRuleSc = require("../models/medicineRuleSc");

const postRule = async(req, res) => {
    const m_rule = req.body.m_rule;
    const details = req.body.details;

    try {
        await medicineRuleSc.create({
            'm_rule': m_rule,
            'details': details
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editRule = async(req, res) => {
    const id = req.params.id;
    const m_rule = req.body.m_rule;
    const details = req.body.details;

    try {
        const oneData = await medicineRuleSc.findByIdAndUpdate(id, {
            'm_rule': m_rule,
            'details': details,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getRule = async(req, res) => {

    try {
        const AllData = await medicineRuleSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err)
    }
}

const deleteRule = async(req, res) => {
    const id = req.params.id;
    
    try {
        await medicineRuleSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleRule = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await medicineRuleSc.findByIdAndUpdate(id, {
            'is_active': is_active,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postRule,
    editRule,
    getRule,
    deleteRule,
    toggleRule,
}