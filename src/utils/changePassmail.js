const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "cureconnect.official@gmail.com",
        pass: "yufi bgbc ulft byan",
    },
  });

  const mailOptions = {
    from: "cureconnect.official@gmail.com",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
