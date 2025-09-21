const nodemailer = require('nodemailer');
const config = require('../config/config');


const transporter = nodemailer.createTransport({
host: config.smtp.host,
port: Number(config.smtp.port) || 587,
secure: false,
auth: {
user: config.smtp.user,
pass: config.smtp.pass,
},
});


async function sendMail({ to, subject, html, text }) {
const msg = {
from: config.emailFrom,
to,
subject,
text,
html,
};
return transporter.sendMail(msg);
}


module.exports = { sendMail };