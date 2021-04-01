const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');
// const { APP_BASE_URL } = require('../config/keys');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

let upload = multer(
    {
        storage,
        limits: { fileSize: 1000000 * 100 },
    }).single('myfile'); //100mb

//for testing 
router.get('/', (req, res) => {
    return res.json("All okay");
})

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    });
});

router.post('/send', async (req, res) => {

    try {
        const { uuid, emailTo, emailFrom } = req.body;

        //validate request
        if (!uuid || !emailTo || !emailFrom) {
            return res.status(422).json({ error: "All fields are required" });
        }

        //get the file from database
        const file = await File.findOne({ uuid });

        if (file.sender) {
            //we have already sent the file to this email id
            return res.status(422).json({ error: "Email already sent." });
        }

        //if we reach here it means file is not sent till now
        file.sender = emailFrom;
        file.receiver = emailTo;

        const response = await file.save();

        //send email
        const sendMail = require('../services/emailService');

        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'inShare file Sharing',
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailTemplate')({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + ' KB',
                expires: '24 hours'
            })
        });
        res.json("email sent");

    }
    catch (err) {
        return res.json({ error: err.message });
    }
});
module.exports = router;