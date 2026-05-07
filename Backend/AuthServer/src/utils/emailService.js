const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "laxmannaikbhukya143@gmail.com",
//     pass: "rlrc qhhw snqi pyhu",
//   },
//   pool: true,
//   maxConnections: 1,
//   rateLimit: true,
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "laxmannaikbhukya143@gmail.com",
    pass: "rlrc qhhw snqi pyhu",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP NOT WORKING:", error);
  } else {
    console.log("SMTP READY");
  }
});

const sendEmailOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Kavas" <laxmannaikbhukya143@gmail.com>`,
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

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
};

module.exports = { sendEmailOtp };