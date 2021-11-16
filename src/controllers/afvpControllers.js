const { OK, SERVER_ERROR } = require('./../helpers/status_codes');
const sendEmail = require('./../utils/sendEmail');
const AppError = require('./../utils/appError');

exports.contactUs = async (req, res) => {
   const { name, email, message } = req.body;

   const messageBody = `
   <h3>Vous avez reçu un message de ${name}</h3>
   <p><b>Courriel</b> : ${email}</p>
   <p style="white-space: pre-line">${message}</p>
   `;
   try {
      await sendEmail({
         email: 'dev-notifications@afvp.net', // contact@afvp.net
         subject: `Site de l'AFVP : ${name} vous a envoyé un message`,
         messageHtml: messageBody
      });   

      res.status(200).json({
         status: 'Succès',
         message: `Votre message a été envoyé !`
      })
   } catch (err) {
      return next(new AppError(`Une erreur s'est produite lors de l'envoi de votre message. Veuillez essayer plus tard !`, SERVER_ERROR));
   }
}
