class Query {
  async sendEmail(to, subject, content) {
    const nodemailer = require("nodemailer");
    const mail = require("../config/mail").getMailDetails();

    var status = "";
    // create reusable transporter object using the default SMTP transport
    let transporter = await nodemailer.createTransport({
      host: mail["hostname"],
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: mail["username"], // generated ethereal user
        pass: mail["password"], // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: mail["name"] + "<" + mail["username"] + ">", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: "", // plain text body
      html: content, // html body
    };

    // send mail with defined transport object
    var status = await transporter.sendMail(mailOptions);

    return status;
  }

  async sendEmailAdmin(to, subject, content, from, from_name) {
    const nodemailer = require("nodemailer");
    const mail = require("../config/mail").getMailDetails();

    var status = "";
    // create reusable transporter object using the default SMTP transport
    let transporter = await nodemailer.createTransport({
      host: mail["hostname"],
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: mail["username"], // generated ethereal user
        pass: mail["password"], // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: from_name + "<" + from + ">", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: "", // plain text body
      html: content, // html body
    };

    // send mail with defined transport object
    var status = await transporter.sendMail(mailOptions);

    return status;
  }
}

module.exports = new Query();
