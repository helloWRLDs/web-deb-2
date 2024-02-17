const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '587',
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APPPASS
    }
});

const sendEmail = (email, subject, body) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: body
    }
    transporter.sendMail(mailOptions, (error, info, callback) => {
        if (error) {
            callback(error)
        }
        console.log(`message sent to ${email} successfuly`)
        callback(null)
    })
}

module.exports = {sendEmail}