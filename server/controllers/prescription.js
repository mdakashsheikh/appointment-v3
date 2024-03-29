const prescriptionSc = require("../models/prescriptionSc");
const patientSc = require("../models/patientSc");

const postPrescribe = async(req, res) => {
    const id = req.params.id;
    const info = req.body.info;

    try {
        const oneData = await patientSc.findByIdAndUpdate(id, {
            'medicine_info': info
        })
        res.send(oneData);
        
    } catch (err) {
        res.status(400).send(err)
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

const postMedicine = async(req, res) => {
    
}

module.exports = {
    postPrescribe,
    editPrescribe,
    getPrescribe,
    deletePrescribe,
    togglePrescribe,
    postMedicine,
}