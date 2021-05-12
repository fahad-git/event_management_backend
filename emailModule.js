var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ems.digital0@gmail.com',
    pass: 'Ems12345'
  }
});

exports.sendEmail = function(data, callback){
    
    var msg = "<h1>Message</h1>" +
              "<h4>Message From: " + data.name + "</h4>" +
              "<h4>Email: " + data.email + "</h4>" +
              "<p>Message: " + data.message + "</p>";

    var mailOptions = {
    from: 'noreply@ems.com',
    to: data.to,
    subject: data.subject,
    
    html: msg
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            callback(error, null);
        } else {
            callback(null, info.response);
        }
      });
}