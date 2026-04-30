// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "laxmannaikbhukya143@gmail.com",
//     pass: "bxqi zoko drqu oncy",
//   },
// });

// const sendEmailOtps = async (email, otp) => {
//   const mailOptions = {
//     from: `Kavas <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Kavas OTP Verification",
//     html: `
//       <div style="font-family: Arial; padding: 10px;">
//         <h2>Your OTP Code</h2>
//         <p>Your verification OTP is:</p>
//         <h1 style="color: #2d89ef;">${otp}</h1>
//         <p>This OTP is valid for 5 minutes.</p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error("Email failed:", err.message);
//     throw new Error("Email sending failed");
//   }
// };

// module.exports = { sendEmailOtp };


import { Resend } from "resend";

const resend = new Resend("re_Dj5LzcqL_GbokfBWNxv4Us5i3Xw15KBoW");

export const sendEmailOtp = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: "Kavas <onboarding@resend.dev>",
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
    });

    console.log("Email sent:", response);
    return response;
  } catch (err) {
    console.error("Resend Error:", err.message);
    throw new Error("Email sending failed");
  }
};