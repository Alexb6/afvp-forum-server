require('dotenv').config();
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = ({ email, subject, message }) => {
   const mailOptions = {
      from: `mail@afvp.net`,
      to: email,
      subject: subject,
      text: message,
      // html:
   }
   
   return sendgrid.send(mailOptions);
}

module.exports = sendEmail;