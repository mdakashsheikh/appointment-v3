const patientSc = require("../models/patientSc");
const smsSc = require("../models/smsSc");
const { send_sms } = require("../sms_api/smsApi");

const postPatient = async(req, res) => {
    const chamber = req.body.chamber;
    const specialist = req.body.specialist;
    const doctor = req.body.doctor;
    const date1 = req.body.date1;
    const time1 = req.body.time1;
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const phone = req.body.phone;
    const details = req.body.details;
    const status = req.body.status;
    const serial = req.body.serial;

    let phone1 = phone;

    if(phone1.slice(0, 2)!= "88" && phone1.length == 11) {
        phone1 = `88${phone1}`
    } else if(phone1.slice(0, 2) && phone1.length >= 14) {
        let tmp = phone1.slice(-11);
        phone1 = `88${tmp}`; 
    } else {
        phone1 = phone1;
    }

    let dateC = date1.toString().slice(0, 10);

    const smsData = await smsSc.findOne({title: 'Serial Update SMS'});

    const smsData1 = smsData.sms1;

    try {
        await patientSc.create({
            "chamber": chamber,
            "specialist": specialist,
            "doctor": doctor,
            "date1": date1,
            "time1": time1,
            "name": name,
            "age": age,
            "gender": gender,
            "phone": phone1,
            "details": details,
            "status": status,
            "serial": serial,
        })
        
        let smsReplace = smsData1.replaceAll("name", name)
            .replaceAll("serial", serial)
            .replaceAll("date", dateC)
            .replaceAll("time", time1)
            .replaceAll("chamber", chamber)

        if(serial) {
            send_sms(phone1, smsReplace);
        }

        res.send(req.body);

    } catch (err) {
        res.status(400).send(err);
    }
}


const editPatient = async(req, res) => {
    const id = req.params.id;
    
    const chamber = req.body.chamber;
    const specialist = req.body.specialist;
    const doctor = req.body.doctor;
    const date1 = req.body.date1;
    const time1 = req.body.time1;
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const phone = req.body.phone;
    const details = req.body.details;
    const status = req.body.status;
    const serial = req.body.serial;

    let phone1 = phone;

    if(phone1.slice(0, 2)!= "88" && phone1.length == 11) {
        phone1 = `88${phone1}`
    } else if(phone1.slice(0, 2) && phone1.length >= 14) {
        let tmp = phone1.slice(-11);
        phone1 = `88${tmp}`; 
    } else {
        phone1 = phone1;
    }

    let dateC = date1.toString().slice(0, 10);

    const smsData = await smsSc.findOne({title: 'Serial Update SMS'});

    const smsData1 = smsData.sms1;

    try {
       
        const oneData = await patientSc.findByIdAndUpdate(id, {
            "chamber": chamber,
            "specialist": specialist,
            "doctor": doctor,
            "date1": date1,
            "time1": time1,
            "name": name,
            "age": age,
            "gender": gender,
            "phone": phone,
            "details": details,
            "status": status,
            "serial": serial,
        })
        
        let smsReplace = smsData1
            .replaceAll("name", name)
            .replaceAll("serial", serial)
            .replaceAll("date", dateC)
            .replaceAll("time", time1)
            .replaceAll("chamber", chamber)

            if(serial) {
                send_sms(phone1, smsReplace);
            }
        
        res.send(oneData);
    } catch (err) {
        res.status(400).send(err);
    }
}


const getPatient = async(req, res) => {
    const jwtToken = req.headers.authorization;
    console.log('jwtToken', jwtToken);

    try {
        const AllData = await patientSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postPatient,
    editPatient,
    getPatient,
}