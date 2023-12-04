require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const AllRoute = require('./routes/route');

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

mongoose.connect(process.env.DB_CONN)
.then(() => console.log('Database Connected'))
.catch((err) => console.log(err));

app.use(AllRoute);

app.listen(PORT, () => {
    console.log(`Listening On PORT ${PORT}`);
})