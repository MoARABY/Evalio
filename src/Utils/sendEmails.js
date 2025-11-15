const nodemailer = require('nodemailer')

// first version have some issues
// first you will build transport connection every time you need to send msg
// so we will use singletone pattern to void this issue
// then we will use try catch while invoce the method not inside it


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
        secure: Number(process.env.EMAIL_PORT) === 465, // Secure only for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmails = async (options) => {
    const mailOpt = {
        from: `"${process.env.EMAIL_USER}" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || undefined,
    };
    await transporter.sendMail(mailOpt)
}


module.exports = sendEmails