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