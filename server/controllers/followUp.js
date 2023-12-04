const fs = require('fs');
const path = require('path');
const followUpSc = require("../models/followUpSc");
const patientSc = require("../models/patientSc");
const smsSc = require("../models/smsSc");
const { send_sms } = require("../sms_api/smsApi");

const dirname = path.join(__dirname, '../uploads');

const postFollow = async(req, res) => {
    const chamber = req.body.chamber;
    const specialist = req.body.specialist;
    const doctor = req.body.doctor;
    const date1 = req.body.date1;
    const time1 = req.body.time1;
    const name = req.body.name;
    const phone = req.body.phone;
    const serial = req.body.serial;
    const id = req.body.id;
    const visit_status = req.body.visit_status;
    const price = req.body.price;
    const followUpDate = req.body.followUpDate;
    const visit_time = req.body.visit_time;
    const file = req.body.file;

    try {
        await followUpSc.create({
           "chamber": chamber,
           "specialist": specialist,
           "doctor": doctor,
           "date1": date1,
           "time1": time1,
           "name": name,
           "phone": phone,
           "serial": serial,
           "patient_id": id,
           "visit_status": visit_status,
           "price": price,
           "followUpDate": followUpDate,
           "visit_time": visit_time,
           "image": file,
       })
       res.send(res.body);
       
   } catch (err) {
       res.status(400).send(err);
   }
}

const editFollow = async(req, res) => {
    const id = req.params.id;
    const price = req.body.price;
    const followUpDate = req.body.followUpDate;
    const visit_time = req.body.visit_time;
    const file = req.body.file;

    console.log("Body",req.body);
    try {
        const oneData = await followUpSc.findByIdAndUpdate(id, {
            "price": price,
            "followUpDate": followUpDate,
            "visit_time": visit_time,
            "image": file,
        })
        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const postFollowImage = async(req, res) => {
    if(req.files == undefined) {
        return;
    }
    
    const image = req.files.map(item => item.filename);

    try {
        res.send({file1: image})

    } catch (err) {
        res.status(400).send({"error": err.message});
    }
}

const getFollow = async(req, res) => {

    try {
        const AllData = await followUpSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(400).send(err);
    }
}

const getFollowImage = (req, res) => {
    const filename = req.params.filename;
    const uploadFolder = './uploads';
    const filepath = path.resolve(path.join(uploadFolder, filename));

    res.send(filepath);
}

const postFollowSMS = async(req, res) => {
    const id = req.params.id;
    const is_active = req.body.is_active;
    const phone = req.body.phone;
    const chamber = req.body.chamber;
    const doctor = req.body.doctor;
    const followDate = req.body.followDate;
    const name = req.body.name;
    const doctorNumber = req.body.doctorNumber;

    const smsData = await smsSc.findOne({title: 'Follow Up SMS'});
    const smsData1 = smsData.sms1;
    const dateC = followDate.toString().slice(0, 10);

    try {
        let smsReplace = smsData1
            .replaceAll("name", name)
            .replaceAll("date", dateC)
            .replaceAll("chamber", chamber)
            .replaceAll("doctor", doctor)
            .replaceAll("cNumber", doctorNumber)

        send_sms(phone, smsReplace);

        const oneData = await followUpSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })
        

        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
}

const editPatientFollow = async(req, res) => {
    const id = req.params.id;
    const visit_status = req.body.visit_status;

    try {
        const oneData = await patientSc.findByIdAndUpdate(id, {
            "visit_status": visit_status
        })
        res.send(oneData);

    } catch ( err ) {
        res.status(400).send(err);
    }
}

const deleteImage = async(req, res) => {
    const {image, id} = req.body;
    const followData = await followUpSc.findOne({_id: id});
    const filterImage = followData.image.filter(item => item != image);

    fs.unlink(dirname + "/" + image, (err) => {
        console.log(err);
    })

    try{
        const oneData = await followUpSc.findByIdAndUpdate(id, {
            'image': filterImage
        })

        res.send(oneData)
    }catch(err) {
        res.status(400).send(err);
    }
}

module.exports = {
    postFollow,
    editFollow,
    postFollowImage,
    getFollow,
    getFollowImage,
    postFollowSMS,
    editPatientFollow,
    deleteImage,
}