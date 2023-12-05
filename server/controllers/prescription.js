const prescriptionSc = require("../models/prescriptionSc");

const postPrescribe = async(req, res) => {
    const medicineTime = req.body.medicineTime;
    const medicineTiming = req.body.medicineTiming;
    const medicineLimite = req.body.medicineLimite;

    try {
        await prescriptionSc.create({
            'medicineTime': medicineTime,
            'medicineTiming': medicineTiming,
            'medicineLimite': medicineLimite
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editPrescribe = async(req, res) => {
    const id = req.params.id;
    const medicineTime = req.body.medicineTime;
    const medicineTiming = req.body.medicineTiming;
    const medicineLimite = req.body.medicineLimite;

    try {
        const oneData = await prescriptionSc.findByIdAndUpdate(id, {
            'medicineTime': medicineTime,
            'medicineTiming': medicineTiming,
            'medicineLimite': medicineLimite
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getPrescribe = async(req, res) => {
    
    try {
        const AllData = await prescriptionSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deletePrescribe = async(req, res) => {
    const id = req.params.id;

    try {
        await prescriptionSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const togglePrescribe = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await prescriptionSc.findByIdAndUpdate(id, {
            'is_active': is_active
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postPrescribe,
    editPrescribe,
    getPrescribe,
    deletePrescribe,
    togglePrescribe,
}