const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailOtp = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP</h2>
        <p>${otp}</p>
      `,
    });

    console.log("OTP email sent successfully");
  } catch (err) {
    console.error("Email send error:", err);
  }
};

const sendWelcomeEmail = async (email, full_name) => {
  try {
    const firstName = (full_name || "there").split(" ")[0];

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to KAVAS Wholesale Hub! 🎉",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to KAVAS</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#0B1F3A;border-radius:12px;overflow:hidden;">

                  <tr>
                    <td style="background:#0B1F3A;padding:32px 40px 24px;text-align:center;">
                      <h1 style="color:#D4AF37;font-size:28px;margin:0;letter-spacing:2px;">KAVAS</h1>
                      <p style="color:#FFF8EC;font-size:13px;margin:6px 0 0;letter-spacing:1px;">WHOLESALE HUB</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:linear-gradient(135deg,#D4AF37 0%,#c9a227 100%);padding:32px 40px;text-align:center;">
                      <h2 style="color:#0B1F3A;font-size:24px;margin:0 0 10px;">🎉 Welcome To Kavas, ${firstName}!</h2>
                      <p style="color:#1A1A1A;font-size:14px;margin:0;">Your account has been successfully created.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:36px 40px;background:#ffffff;">
                      <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 20px;">
                        Hi <strong>${firstName}</strong>,<br/><br/>
                        Thank you for registering with <strong>KAVAS Wholesale Hub</strong>. You're now part of a growing community of 50,000+ businesses getting the best wholesale prices in India.
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                        <tr>
                          <td style="padding:12px;background:#FFF8EC;border-left:4px solid #D4AF37;border-radius:4px;">
                            <p style="margin:0;color:#1A1A1A;font-size:14px;">📦 <strong>What's next?</strong></p>
                            <ul style="margin:10px 0 0 18px;padding:0;color:#555;font-size:13px;line-height:2;">
                              <li>Browse thousands of wholesale products</li>
                              <li>Get exclusive bulk pricing on every order</li>
                              <li>Track your orders in real time</li>
                              <li>Save your favourite products for later</li>
                            </ul>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/?login=true"
                               style="display:inline-block;background:#D4AF37;color:#0B1F3A;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">
                              Login to Your Account →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#0B1F3A;padding:24px 40px;text-align:center;">
                      <p style="color:#ffffff88;font-size:12px;margin:0 0 6px;">Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color:#D4AF37;text-decoration:none;">${process.env.EMAIL_USER}</a></p>
                      <p style="color:#ffffff55;font-size:11px;margin:0;">© ${new Date().getFullYear()} KAVAS Wholesale Hub. All rights reserved.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (err) {

    console.error("Welcome email send error:", err.message);
  }
};

module.exports = {
  sendEmailOtp,
  sendWelcomeEmail,
};