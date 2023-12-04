const availabilitySc = require("../models/availabilitySc");

const postAvail = async(req, res) => {
    const dname = req.body.dname;
    const chamber = req.body.chamber;
    const days1 = req.body.days1;
    const saturdayT = req.body.saturdayT;
    const sundayT = req.body.sundayT;
    const mondayT = req.body.mondayT;
    const tuesdayT =req.body.tuesdayT;
    const wednesdayT = req.body.wednesdayT;
    const thursdayT = req.body.thursdayT;
    const fridayT = req.body.fridayT;
    const serial = req.body.serial;

    try {
        await availabilitySc.create({
            "dname": dname,
            "chamber": chamber,
            "days1": days1,
            "saturdayT": saturdayT,
            "sundayT": sundayT,
            "mondayT": mondayT,
            "tuesdayT": tuesdayT,
            "wednesdayT": wednesdayT,
            "thursdayT": thursdayT,
            "fridayT": fridayT,
            "serial": serial,
        })
        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editAvai = async(req, res) => {
    const id = req.params.id;
    const dname = req.body.dname;
    const chamber = req.body.chamber;
    const days1 = req.body.days1;
    const saturdayT = req.body.saturdayT;
    const sundayT = req.body.sundayT;
    const mondayT = req.body.mondayT;
    const tuesdayT =req.body.tuesdayT;
    const wednesdayT = req.body.wednesdayT;
    const thursdayT = req.body.thursdayT;
    const fridayT = req.body.fridayT;
    const serial = req.body.serial;

    try {
        const oneData = await availabilitySc.findByIdAndUpdate(id, {
            "dname": dname,
            "chamber": chamber,
            "days1": days1,
            "saturdayT": saturdayT,
            "sundayT": sundayT,
            "mondayT": mondayT,
            "tuesdayT": tuesdayT,
            "wednesdayT": wednesdayT,
            "thursdayT": thursdayT,
            "fridayT": fridayT,
            "serial": serial,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const getAvail = async(req, res) => {
    
    try {
        const AllData = await availabilitySc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteAvail = async(req, res) => {
    const id = req.params.id;

    try {
        await availabilitySc.findByIdAndRemove(id);
        res.send('Deleted');

    } catch (err) {
        res.status(400).send(err);
    }
}

const toggleAvail = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;

    try {
        const oneData = await availabilitySc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postAvail,
    editAvai,
    getAvail,
    deleteAvail,
    toggleAvail,
}