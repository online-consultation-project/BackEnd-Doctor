const nodemailer = require("nodemailer");

const sendMailToUser = async (email,name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cureconnect.official@gmail.com",
        pass: "yufi bgbc ulft byan",
      },
    });

    const mailOptions = {
      from: "cureconnect.official@gmail.com",
      to: email,
      subject: "Welcome To Our Website - Cure Connect",
      text: `hello ${name} This is Our Website login Credintial\n\n username: ${email}\n password: ${password}`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Mail Send Successfully to  ${email}`);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  sendMailToUser,
};
