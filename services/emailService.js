const nodemailer = require('nodemailer');
// const { SMTP_HOST, SMTP_PORT, MAIL_USER, MAIL_PASS } = require('../config/keys');

const sendMail = async ({ from, to, subject, text, html }) => {

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    });
}

module.exports = sendMail;