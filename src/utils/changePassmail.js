const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
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
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;


// 7oMXiRnvSL21UKbidU6HbA

// F8f2FLfUGwXe5fcRDqr5IXldrxo2ogce


// a9mja1ZJR6-9iw8WgkP1QQ

// gBfkq5RGRaCyEX81EO3QoQ


// Account Id : jFpE5skARfC2pcDqQML8MA,

// client Id : tWq_onbnTwurXhQ4_uIeKg,

// security  : KCPVGpyQslLPNOVwJt98fHiYtAQC824T