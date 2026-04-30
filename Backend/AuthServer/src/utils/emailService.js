const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "laxmannaikbhukya143@gmail.com",
    pass: "bxqi zoko drqu oncy",
  },
});

const sendEmailOtp = async (email, otp) => {
  const mailOptions = {
    from: `Kavas <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Kavas OTP Verification",
    html: `
      <div style="font-family: Arial; padding: 10px;">
        <h2>Your OTP Code</h2>
        <p>Your verification OTP is:</p>
        <h1 style="color: #2d89ef;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email failed:", err.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmailOtp };