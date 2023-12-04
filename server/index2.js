require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const masterSc = require('./models/masterSc');
const patientSc = require('./models/patientSc');
const chamberSc = require('./models/chamberSc');
const timeSc = require('./models/timeSc');
const availabilitySc = require('./models/availabilitySc');
const doctorSc = require('./models/doctorSc');
const specialistSc = require('./models/specialistSc');
const jwt = require('jsonwebtoken');
const operatorSc = require('./models/operatorSc');
const smsSc = require('./models/smsSc');
let multer = require('multer');
const path = require('path');
const followUpSc = require('./models/followUpSc');
const followUpSmsSc = require('./models/followUpSmsSc');

const app = express();

const secretKey = "secretkey";

app.use(express.static('public'))
app.use(express.static('files'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONN)
.then(()=> console.log('Database Connected...'))
.catch(err => console.log(err))


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Hello World');
})


app.post('/master-data', async(req, res) => {

    const chamber = req.body.chamber;
    const specialist = req.body.specialist;
    const dr_name = req.body.dr_name;
    const s_time = req.body.s_time;
    
    try {

        await masterSc.create({
            'chamber': chamber,
            'specialist': specialist,
            'dr_name': dr_name,
            's_time': s_time,
        })
        res.send(req.body);

    } catch (err) {
        res.send(err);
    }
})



//------------------------------------------------------For Client------------------------------------------------------

app.post('/client-data', async(req, res) => {

    console.log(req.body);
    
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
        console.log(err);
    }
})

app.get('/get-test', async(req, res) => {
    const allSMS = await smsSc.find({title: 'title1'});
    let smsData = allSMS.map(item => item.sms1).toString();
    let type1 = typeof smsData;

    res.send({
        allSMS,
        smsData,
        type1
    })

})

app.post('/edit-patient/:id', async(req, res) => {
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
        res.send(err)
    }
})

app.post('/editPatien-follow/:id', async(req, res) => {
    const id = req.params.id;

    const visit_status = req.body.visit_status;

    console.log("HEllo")

    try {
        const oneData = await patientSc.findByIdAndUpdate(id, {
            "visit_status": visit_status,
        })

        res.send(oneData);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/get-data', async(req, res) => {
    const jwtToken = req.headers.authorization;
    console.log('jwtToken', jwtToken)

    
    try {
        const AllData = await patientSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.send(err);
    }
})

//------------------------------------------------------Follow UP------------------------------------------------------

app.post('/follow-up', async(req, res) => {
    
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
        console.log(err)
        res.send(err);
    }

})


app.post('/edit-follow/:id', async(req, res) => {
    const id = req.params.id;
    console.log(id, "ID-------------->")

    const price = req.body.price;
    const followUpDate = req.body.followUpDate;
    const visit_time = req.body.visit_time;

    try {
        const oneData = await followUpSc.findByIdAndUpdate(id, {
            "price": price,
            "followUpDate": followUpDate,
            "visit_time": visit_time,
        })

        res.send(oneData);

    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/follow-image', upload.array('photo', 10), async(req, res) => {

    if(req.files == undefined) {
        return;
    }
    
    const image = req.files.map(item => item.filename);
    try {
        res.send({file1: image})
    } catch (err) {
        res.send({"error": err.message});
    }
})

app.get('/get-follow', async(req, res) => {
    try {
        const AllData = await followUpSc.find({}).sort('-date');
        res.send({AllData});
        
    } catch (err) {
        res.send(err);
    }
})

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const uploadFolder = './uploads';
    const filepath = path.resolve(path.join(uploadFolder, filename));

    res.send(filepath);
})


app.post('/sendFollowSMS', async(req, res) => {
    const patient_id = req.body.fid;
    const phone = req.body.fPhone;
    const status = req.body.status;

    const smsData = await smsSc.findOne({title: 'Serial Update SMS'});

    const smsData1 = smsData.sms1;

    try{
        await followUpSmsSc.create({
            "patient_id": patient_id,
            "phone": phone,
            "status": status,
        })

        // send_sms(phone, smsData1)
        res.send(req.body)
    } catch (err) {
        res.status(400).send(err)
    }
})

app.post('/success-sms/:id', async(req, res) => {
    const id = req.params.id;

    const is_active = req.body.is_active;
    const phone = req.body.phone;
    const chamber = req.body.chamber;
    const doctor = req.body.doctor;
    const followDate = req.body.followDate;
    const name = req.body.name;
    const doctorNumber = req.body.doctorNumber;

    console.log(req.body)

    const smsData = await smsSc.findOne({title: 'Follow Up SMS'});

    const smsData1 = smsData.sms1;
    const dateC = followDate.toString().slice(0, 10);

    try {
        const oneData = await followUpSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })

        let smsReplace = smsData1
            .replaceAll("name", name)
            .replaceAll("date", dateC)
            .replaceAll("chamber", chamber)
            .replaceAll("doctor", doctor)
            .replaceAll("cNumber", doctorNumber)

        send_sms(phone, smsReplace);
        res.send(oneData);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/getFolloSms', async(req, res) => {
    try {
        const AllData = await followUpSmsSc.find({});
        res.send({AllData});

    } catch (err) {
        res.send(err);
    }
})

//------------------------------------------------------Master Chamber------------------------------------------------------

app.post('/post-chamber', async(req, res) => {
    
    console.log(req.body);

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
        console.log(err)
    }
})

app.post('/edit-chamber/:id', async(req, res) => {
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
        res.send(err)
    }
})

app.post('/toggle-chamber/:id', async(req, res) => {
    const id = req.params.id;

    const is_active = req.body.is_active;

    try {
        const oneData = await chamberSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })
        

        res.send(oneData);

    } catch (err) {
        res.send(err);
    }
})

app.get('/get-chamber', async(req, res) => {
    try {
        const AllData = await chamberSc.find({});
        res.send({AllData});

    } catch (err) {
        res.status(404).send(err);
        console.log(err);
    }
})

app.delete('/delete-chamber/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await chamberSc.findByIdAndRemove(id);
        res.send('Deleted');
    } catch (err) {
        res.send(err);
    }
})

//------------------------------------------------------Master Time Management------------------------------------------------------
app.post('/post-time', async(req, res) => {
    
    console.log(req.body);

    const st_time = req.body.st_time;
    const en_time = req.body.en_time;

    try {
        await timeSc.create({
            "st_time": st_time,
            "en_time": en_time,
        })
        res.send(req.body);

    } catch (err) {
        res.status(404).send(err);
        console.log(err)
    }
})

app.post('/edit-time/:id', async(req, res) => {
    const id = req.params.id;
    
    const st_time = req.body.st_time;
    const en_time = req.body.en_time;

    try {
        const oneData = await timeSc.findByIdAndUpdate(id, {
            "st_time": st_time,
            "en_time": en_time,
        })
        res.send(oneData);
    } catch (err) {
        res.send(err)
    }
})

app.post('/toggle-time/:id', async(req, res) => {
    const id = req.params.id;

    const is_active = req.body.is_active;

    try {
        const oneData = await timeSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })

        res.send(oneData);

    } catch (err) {
        res.send(err);
    }
})

app.get('/get-time', async(req, res) => {
    try {
        const AllData = await timeSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.status(404).send(err);
        console.log(err);
    }
})

app.delete('/delete-time/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await timeSc.findByIdAndRemove(id);
        res.send('Deleted');
    } catch (err) {
        res.send(err);
    }
})


//------------------------------------------------------Availability Management------------------------------------------------------

app.post('/post-available', async(req, res) => {
    console.log(req.body);

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
        console.log(err)
    }
})

app.post('/edit-available/:id', async(req, res) => {
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
        res.send(err)
    }
})

app.post('/toggle-available/:id', async(req, res) => {
    const id = req.params.id;

    const is_active = req.body.is_active;

    try {
        const oneData = await availabilitySc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })

        res.send(oneData);

    } catch (err) {
        res.send(err);
    }
})

app.get('/get-available', async(req, res) => {
    try {
        const AllData = await availabilitySc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.send(err);
    }
})

app.delete('/delete-available/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await availabilitySc.findByIdAndRemove(id);
        res.send('Deleted');
    } catch (err) {
        res.send(err);
    }
})


//------------------------------------------------------Doctor Management------------------------------------------------------

app.post('/post-doctor', async(req, res) => {
    console.log(req.body);

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
        res.send(err)
    }
})

app.post('/edit-doctor/:id', async(req, res) => {
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
})

app.post('/toggle-doctor/:id', async(req, res) => {
    const id = req.params.id;

    const is_active = req.body.is_active;

    try {
        const oneData = await doctorSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })

        res.send(oneData);

    } catch (err) {
        res.send(err);
    }
})

app.get('/get-doctor', async(req, res) => {
    try {
        const AllData = await doctorSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.send(err);
    }
})

app.delete('/delete-doctor/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await doctorSc.findByIdAndRemove(id);
        res.send('Deleted');
    } catch (err) {
        res.send(err);
    }
})


//------------------------------------------------------Specialization Management------------------------------------------------------

app.post('/post-specialist', async(req, res) => {
    console.log(req.body);

    const specialist = req.body.specialist;
    const details = req.body.details;

    try {
        await specialistSc.create({
            "specialist": specialist,
            "details": details,
        })

        res.send(req.body);
    } catch (err) {
        res.send(err);
    }
})

app.post('/edit-specialist/:id', async(req, res) => {
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
        res.send(err)
    }
})

app.post('/toggle-specialist/:id', async(req, res) => {
    const id = req.params.id;

    const is_active = req.body.is_active;

    try {
        const oneData = await specialistSc.findByIdAndUpdate(id, {
            "is_active": is_active,
        })

        res.send(oneData);

    } catch (err) {
        res.send(err);
    }
})

app.get('/get-specialist', async(req, res) => {
    try {
        const AllData = await specialistSc.find({}).sort('-date');
        res.send({AllData});

    } catch (err) {
        res.send(err);
    }
})

app.delete('/delete-specialist/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await specialistSc.findByIdAndRemove(id);
        res.send('Deleted');
    } catch (err) {
        res.send(err);
    }
})

//------------------------------------------------------Operator------------------------------------------------------

app.post('/post-operator', async(req, res) => {
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
        res.send(err)
    }
})

app.post('/edit-operator/:id', async(req, res) => {
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

        res.send(oneData);
        
    } catch (err) {
        res.send(err)
    }
})

app.get('/get-operator', async(req, res) => {
    try {
        const AllData = await operatorSc.find({}).sort('-date');
        res.send({AllData})
    } catch (err) {
        res.send(err);
    }
})

app.delete('/delete-operator/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await operatorSc.findByIdAndRemove(id);
        res.send('Deleted')
    } catch (err) {
        res.send(err);
    }
})

//------------------------------------------------------SMS TEMPLATE------------------------------------------------------
app.post('/post-sms', async(req, res) => {
    const title = req.body.title;
    const sms1 = req.body.sms1;

    try {
        await smsSc.create({
            "title": title,
            'sms1': sms1
        })

        res.send(req.body)
    } catch (err) {
        res.send(err)
    }
})

app.post('/edit-sms/:id', async(req, res) => {
    const id = req.params.id;
    
    const title = req.body.title;
    const sms1 = req.body.sms1;

    try {
        const oneDate = await smsSc.findByIdAndUpdate(id, {
            "title": title,
            "sms1": sms1,

        })

        res.send(oneDate);

    } catch (err) {
        res.send(err);
    }
})

app.get('/get-sms', async(req, res) => {
    try {
        const AllData = await smsSc.find({}).sort('-date');
        res.send({AllData})
    } catch (err) {
        res.send(err);
    }
})

app.delete('/delete-sms/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await smsSc.findByIdAndRemove(id);
        res.send('Deleted.')
    } catch (err) {
        res.send(err);
    }
})

//------------------------------------------------------login-Assistant------------------------------------------------------
app.post('/login-assistant', async(req, res) => {
    const {userName, password} = req.body;
    console.log({userName, password});

    const checkUser = userName;
    console.log('checkUser', checkUser);

    const MasterData = await operatorSc.find({userName: checkUser});
    const userName1 = MasterData.map(item => item.userName).toString();
    const password1 = MasterData.map(item => item.password).toString();

    console.log(password1);
    console.log(MasterData);

    if(password == password1 ) {
        if(userName == userName1 ) {
            jwt.sign({userName}, secretKey, {expiresIn: '3000s'}, (err, token) => {
                res.send({
                    token,
                    password1,
                    userName1
                })
            })
        } else {
            res.status(400).send("username or phone is wrong")
        }
    } else {
        res.status(400).send("Password is wrong");
    }
    
})


app.post("/super-admin", async(req, res) => {
    const {userName, password} = req.body;
    console.log({userName, password});
    if(password == "nitto123" ) {
        if(userName == "superadmin" ) {
            jwt.sign({userName}, secretKey, {expiresIn: '3000s'}, (err, token) => {
                res.send({
                    token
                })
            })
        } else {
            res.status(400).send("username or phone is wrong")
        }
    } else {
        res.status(400).send("Password is wrong");
    }
})

app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) =>{
        const secretKey = "secretkey";
        if(err) {
            res.send({
                result: "invalid token"
            })
        } else {
            res.send({
                message: "Profile Accessed",
                authData
            })
        }
    })
})

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;

        next();

    } else {
        res.send({
            result: "Token is not valid"
        })
    }
}


//------------------------------------------------------SMS API------------------------------------------------------

const API_KEY = process.env.API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
function send_sms(number, text) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "SenderId": "8809638011122",
    "Is_Unicode": true,
    "Message": text,
    "MobileNumbers": number,
    "ApiKey": API_KEY,
    "ClientId": CLIENT_ID
    })

    console.log(raw, 'raw')

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("https://sms.novocom-bd.com/api/v2/SendSMS", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


app.listen(5000, () => {
    console.log('Listening on port 5000')
})