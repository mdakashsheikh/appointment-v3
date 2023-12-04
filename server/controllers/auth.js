const operatorSc = require('../models/operatorSc')
const secretKey = "secretkey";
const jwt = require('jsonwebtoken');

const assistAdmin = async(req, res) => {
    const {userName, password} = req.body;

    const checkUser = userName;

    const MasterData = await operatorSc.find({ userName: checkUser});
    const userName1 = MasterData.map(item => item.userName).toString();
    const password1 = MasterData.map(item => item.password).toString();

    if(password == password1) {
        if(userName == userName1) {
            jwt.sign({userName}, secretKey, {expiresIn: '3000'}, (err, token) => {
                res.send({
                    token,
                    userName1,
                    password1
                })
            })
        } else {
            res.status(400).send({
                message: 'USERNAME IS WRONG'
            })
        }
    } else {
        res.status(400).send({
            message: 'PASSWORD IS WRONG.'
        })
    }

}

const superAdmin = async(req, res) => {
    const { userName, password } = req.body;
    
    if(password == 'nitto123') {
        if( userName == 'superadmin' ) {
            jwt.sign( {userName}, secretKey, {expiresIn: '3000'}, (err, token) => {
                res.send({
                    token
                })
            })
        } else {
            res.status(400).send({
                message: 'USERNAME IS WRONG'
            })
        }
    } else {
        res.status(400).send({
            message: 'PASSWORD IS WRONG'
        })
    }
}


const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;

        next();
    } else {
        res.status(400).send({
            message: "TOKEN IS INVALID"
        })
    }
}

module.exports = {
    superAdmin,
    assistAdmin
}