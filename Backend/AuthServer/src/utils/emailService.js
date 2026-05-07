// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "laxmannaikbhukya143@gmail.com",
//     pass: "rlrc qhhw snqi pyhu",
//   },
// });

// const sendEmailOtp = async (email, otp) => {
//   try {
//     const mailOptions = {
//       from: `"Kavas" <laxmannaikbhukya143@gmail.com>`,
//       to: email,
//       subject: "Kavas OTP Verification",
//       html: `
//         <div style="font-family: Arial; padding: 10px;">
//           <h2>OTP Verification</h2>
//           <p>Your OTP is:</p>
//           <h1 style="color:#2d89ef">${otp}</h1>
//           <p>This OTP is valid for 5 minutes.</p>
//         </div>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (err) {
//     console.error("❌ Email send failed:", err.message);
//     throw err;
//   }
// };

// module.exports = { sendEmailOtp };

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // IMPORTANT (SSL)
  auth: {
    user: "laxmannaikbhukya143@gmail.com",
    pass: "rlrc qhhw snqi pyhu",
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
  socketTimeout: 15000,
});

const sendEmailOtp = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Kavas" <laxmannaikbhukya143@gmail.com>`,
      to: email,
      subject: "OTP Verification",
      html: `<h1>Your OTP: ${otp}</h1>`,
    });

    console.log("✅ EMAIL SENT:", info.messageId);
    return info;
  } catch (err) {
    console.log("❌ EMAIL ERROR FULL:", err);
    throw err;
  }
};

module.exports = { sendEmailOtp };