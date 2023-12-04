const doctorSc = require("../models/doctorSc");

const postDoctor = async(req, res) => {
    const name = req.body.name;
    const specialist = req.body.specialist;
    const designation = req.body.designation;
    const degree = req.body.degree;
    const experience = req.body.experience;

    try {
        await doctorSc.create({
            "name": name,
            "specialist": specialist,
            "designation": designation,
            "degree": degree,
            "experience": experience,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}


const editDoctor = async(req, res) => {
    
    const id = req.params.id;
    const name = req.body.name;
    const specialist = req.body.specialist;
    const designation = req.body.designation;
    const degree = req.body.degree;
    const experience = req.body.experience;

    try {
        const oneData = await doctorSc.findByIdAndUpdate(id, {
            "name": name,
            "specialist": specialist,
            "designation": designation,
            "degree": degree,
            "experience": experience,
        })
        res.send(oneData);

    } catch (err) {
        res.send(err)
    }
}


const getDoctor = async(req, res) => {
    
    try {
        const AllData = await doctorSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteDoctor = async(req, res) => {
    const id = req.params.id;

    try {
        await doctorSc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleDoctor = async(req, res) => {
    
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await doctorSc.findByIdAndUpdate(id, {
            "is_active": is_active
        })
        
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}
module.exports = {
    postDoctor,
    editDoctor,
    getDoctor,
    deleteDoctor,
    toggleDoctor,
}