// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
"use strict"

const Mailgun = require('mailgun').Mailgun;
const mailgun = new Mailgun('87c34c41-e885f6d9');
const nodemailer = require("nodemailer");


function EmailSenders(AWS) {
  const sesClient = new AWS.SES({apiVersion: '2010-12-01'}); // reads AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from process.env

  function sendTextEmailWithSes(sender, recipient, subject, text) {
    console.log("sending email with SES: " + [sender, recipient, subject, text].join(" "));

    return new Promise(function(resolve, reject) {
      sesClient.sendEmail({
        Destination: {
          ToAddresses: [recipient],
        },
        Source: sender,
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: {
              Data: text,
            },
          },
        },

      }, function(err, data) {
        if (err) {
          console.error("polis_err_ses_email_send_failed");
          console.error("Unable to send email via ses to " + recipient);
          console.error(err);
          reject(err);
        } else {
          console.log("sent email with ses to " + recipient);
          resolve();
        }
      });
    });
  }


  function sendTextEmailWithBackup(sender, recipient, subject, text) {
    console.log("sending email with mailgun: " + [sender, recipient, subject, text].join(" "));
    let servername = "";
    let options = {};
    return new Promise(function(resolve, reject) {
      mailgun.sendText(sender, [recipient], subject, text, servername, options, function(err) {
        if (err) {
          console.error("Unable to send email via mailgun to " + recipient + " " + err);
          console.error("polis_err_mailgun_email_send_failed");
          reject(err);
        } else {
          console.log("sent email with mailgun to " + recipient);
          resolve();
        }
      });
    });
  }


  function sendTextEmail(sender, recipient, subject, text) {

    const send = require('gmail-send')({
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      to:   recipient,
      subject: subject,
    });

    send({
      text:   text,  
    }, (error, result, fullResult) => {
      if (error) console.error(error);
      console.log(result);
    })
    
     // let transporter = nodemailer.createTransport({
     //    host: 'smtp.gmail.com', // Gmail Host
     //    port: 587, // Port
     //    secure: true, // this is true as port is 465
     //    auth: {
     //        user: 'interlab@ait.asia', // generated ethereal user
     //        pass: 'interlab2010', // generated ethereal password
     //    },
     //  });
   
     //  // send mail with defined transport object
     //  let info =  transporter.sendMail({
     //      from: '"interlab" <interlab@ait.asia>', // sender address
     //      to: [recipient], // list of receivers
     //      subject: subject, // Subject line
     //      //text: "Hello world?", // plain text body
     //      html: text, // html body
     //  });

  }

  return {
    sendTextEmail: sendTextEmail,
    sendTextEmailWithBackupOnly: sendTextEmailWithBackup,
  };
}


module.exports = {
  EmailSenders: EmailSenders,
};