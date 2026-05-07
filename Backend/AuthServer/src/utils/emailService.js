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

// IMPORTANT: use explicit SMTP config (NOT service: "gmail")
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "laxmannaikbhukya143@gmail.com",
    pass: "rlrc qhhw snqi pyhu", // Gmail App Password ONLY
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// optional: verify connection on server start
transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

const sendEmailOtp = async (email, otp) => {
  try {
    console.log("📨 Sending OTP email to:", email);

    const mailOptions = {
      from: `"Kavas" <${process.env.EMAIL_USER || "laxmannaikbhukya143@gmail.com"}>`,
      to: email,
      subject: "Kavas OTP Verification",
      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#2d89ef">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ EMAIL SENT SUCCESSFULLY:", info.response || info.messageId);

    return info;
  } catch (err) {
    console.error("❌ EMAIL SEND FAILED FULL ERROR:", err);
    throw err;
  }
};

module.exports = { sendEmailOtp };