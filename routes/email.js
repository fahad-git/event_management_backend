// var nodemailer = require('nodemailer');
// const senderEmail = 'losifarluv@gmail.com';

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: senderEmail,
//     pass: 'losifarluvluvluv'
//   }
// });

// const sendMail = (emailTo, subjectLine, emailBody) => {
//     var mailOptions = {
//     from: senderEmail,
//     to: emailTo,
//     subject: subjectLine,
//     text: emailBody
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//         return error;
//     } else {
//         console.log('Email sent: ' + info.response);
//         return info.response;
//     }
//     });
// }

// exports.sendMail = sendMail;