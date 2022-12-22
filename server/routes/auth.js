const express = require('express');
const router = express.Router();
require("dotenv").config({ path: './config.env' });
const User = require('../models/User');
const crypto = require("crypto");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const sendEmail = require('../utils/sendEmail')
const JWT_SECRET = process.env.JWTSECTRET;
const nodemailer = require("nodemailer");
const Token = require("../models/Token");
const forgoturl = process.env.SEND_URL

router.post('/',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),],
    (req,res)=>{
    User.create({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
    }).then(user=>res.json(user))
})

//ROUTE:1 Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = true;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            success = false
            return res.status(400).json({ success, error: "Sorry User with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const SecurePass = await bcrypt.hash(req.body.password, salt)//Generate hash value of a password

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: SecurePass
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        //   console.log(jwtData);

        //   res.json(user)

        res.json({ success, authToken })

    } catch (error) {
        success = false
        return res.status(500).json({ success, errors: "Internal Server Error" });
    }

})



//ROUTE:2 Authenticate a User using: POST "/api/auth/login". 
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be a blank').exists(),
], async (req, res) => {

    let success = true;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false
            return res.status(400).json({ success, error: "Please enter correct credentials" })
        }

        const passCompare = await bcrypt.compare(password, user.password)

        if (!passCompare) {
            success = falsgoe
            return res.status(400).json({ success, error: "Please enter correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success, authToken })

    } catch (error) {
        success = false
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
    }
})



//ROUTE:3 Get logged in user details using: POST "/api/auth/getuser". Login Required

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let success = true
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.json({ success, user })
    } catch (error) {
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
    }
})

//ROUTE:4 Reset Password Sent Link using: POST "/api/auth/forgotpassword".
router.post('/forgotpassword', [
    body('email', 'Enter a valid email').isEmail()],
    async (req, res) => {

        let success = true;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false
            res.json({ success, message: "Some Error Occured Please Try Again!" });
        }
        try {
            let user = await User.findOne({ email: req.body.email })

            if (!user) {
                success = false
                res.json({ success, message: "User with given email does not exist" })
            }
            const data = {
                user: {
                    id: user._id
                }
            }
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
            const url = `${forgoturl}/${user.id}/${token.token}`

            //​Create transport + auth​
            let transporter = nodemailer.createTransport({
                service: "​gmail",
                port: 587,
                auth: {
                    user: process.env.Email,
                    pass: process.env.Email_Pass
                }
            });

            //​Create the message object​
            let message = {
                from: process.env.Email,
                to: user.email,
                subject: "iNotes Reset Password Link",
                html: `
                
                <p>Your Link for reset Password is ${url}</p>
                <br>
                <br>
                <br>
                <p>Thanks & Regards,
                <br>
                   iNotes</p>`
                //​ html: "<p>HTML version of the message</p>"​
            };

            //​Send mail​
            await transporter.sendMail(message, (err) => {
                if (err) {
                    success = false
                    res.json({ success, message: "There is Some Error occured to sent a mail" })
                }
                else {
                    res.json({ success, message: "Reset Link successfully sent to your email" })
                }
            })


        } catch (error) {
            success = false
            res.status(500).send(success, "Internal Server Error");
        }
    })


//ROUTE:5 Reset Password Link Verify using: GET "/api/auth/:id/:token".

router.get('/:id/:token', async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(400).send("Invalid url");
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.status(400).send({ message: "Invalid link" });

        res.status(200).send({ message: "Valid Url" })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE:6 Reset Password using: POST "/api/auth/:id/:token".

router.post('/:id/:token', [
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = true;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            success = false
            res.status(400).send("Invalid url");
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) {
            success = false
            res.status(400).send({ message: "Invalid link" });
        }

        const salt = await bcrypt.genSalt(10);
        const SecurePass = await bcrypt.hash(req.body.password, salt)//Generate hash value of a password
        user.password = SecurePass;
        user.save();
        token.remove();
        res.json({ success, message: "Password Reseted Successfully" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE:7 GOOGLE SIGN IN using: POST "/api/auth/googlesignin".

router.post('/googlesignin', [
    body('name', 'Enter a valid name'),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = true;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            res.json({ success, authToken })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const SecurePass = await bcrypt.hash(req.body.password, salt)//Generate hash value of a password

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: SecurePass
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success, authToken })
        }
    } catch (error) {
        success = false
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
    }

})



//ROUTE:8 GOOGLE SIGN IN using: POST "/api/auth/facebooksignin".

router.post('/facebooksignin', [
    body('name', 'Enter a valid name'),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = true;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            res.json({ success, authToken })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const SecurePass = await bcrypt.hash(req.body.password, salt)//Generate hash value of a password

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: SecurePass
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success, authToken })
        }
    } catch (error) {
        success = false
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
    }

})


module.exports = router


