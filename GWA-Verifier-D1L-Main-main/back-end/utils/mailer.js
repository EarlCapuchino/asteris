'use strict';
const nodemailer = require("nodemailer");

// Get credentials from env
const { 
  SERVICE_TYPE,
  ACCOUNT_EMAIL,
  ACCOUNT_PASSWORD
} = process.env

// Utility function for sending the OTP to a specified email address
exports.sendOTP = async (recipientFirstName, recipientLastName, recipientEmail, OTP) => {
  // Configure transporter object
  let transporter = nodemailer.createTransport({
    service: SERVICE_TYPE,
    auth: {
      user: ACCOUNT_EMAIL,
      pass: ACCOUNT_PASSWORD
    }
  });

  // Configure email header and body
  let mailOptions = {
    from: `ASTERIS Team <${ACCOUNT_EMAIL}>`,
    to: `${recipientFirstName} ${recipientLastName} <${recipientEmail}>`,
    subject: '[ASTERIS] One-Time Password (OTP) for Password Reset',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css'>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            font-size: 16px;
            font-color: #FFFFFF;
          }

          .card-style {
            width: 60%; 
            background-color: #F5F5F5; 
            padding-bottom: 10px;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }

          .card-banner {
            background-color: #8D1436;
            padding: 10px;
          }

          .card-banner-img {
            width: 40%;
            display: block;
            margin-left: auto;
            margin-right: auto;
            margin-top: 6px;
            margin-bottom: 6px;
          }

          .small-text {
            font-size: smaller;
          }
        </style>
      </head>  
      <body>
        <div class='card card-style rounded-3'>
          <div class='card-banner'>
            <img src="https://i.ibb.co/yVdn6nX/asteris-logo.png" class='card-img-top card-banner-img' alt='ASTERIS Logo'>
          </div>
          <div class='card-body' style='margin: 0 20px'>
            <h2 class='card-title'>Hi, <span>${recipientFirstName}</span>!</h2>
            <p class='card-text'>We received a request to reset the password on your ASTERIS account.</p>
            <h1 class='card-text'>${OTP}</h1>
            <p class='card-text'>This code will be valid for <b>1 minute</b>. Use this code to confirm the password reset.</p><hr>
            <p class='card-text small-text'><i><b>If you did not make this request,</b> please email the ASTERIS DevTeam immediately through <b style='color:blue'>asteris.dev@gmail.com</b></i></p>
          </div>
        </div>
      </body>
    </html>
    `
  }

  // Send mail using the transporter object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw(err);
    else console.log('Successfully sent the OTP email!');
  });

}