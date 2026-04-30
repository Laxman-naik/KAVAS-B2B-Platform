// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import db from "../config/db.js";
// import axios from "axios";
// import { sendEmailOtp } from "../utils/emailService.js";

// const otpStore = new Map();

// /* ================= REGISTER VENDOR ================= */
// export const registerVendor = async (req, res) => {
//   const client = await db.connect();

//   try {
//     const { email, phone, password, confirmPassword } = req.body;

//     const emailData = otpStore.get(email);
//     const phoneData = otpStore.get(phone);

//     if (!emailData?.verified || !phoneData?.verified) {
//       return res.status(400).json({ message: "Verify OTP before registration" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     if (email) {
//   const emailData = otpStore.get(email);
//   if (!emailData?.verified) {
//     return res.status(400).json({ message: "Email OTP not verified" });
//   }
// }

// if (phone) {
//   const phoneData = otpStore.get(phone);
//   if (!phoneData?.verified) {
//     return res.status(400).json({ message: "Phone OTP not verified" });
//   }
// }

//     await client.query("BEGIN");

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const vendorResult = await client.query(
//       `INSERT INTO vendorprofile (
//         email, phone, password_hash, email_verified, phone_verified
//       )
//       VALUES ($1, $2, $3, true, true)
//       RETURNING id`,
//       [email, phone, hashedPassword]
//     );

//     const vendorId = vendorResult.rows[0].id;

//     const onboarding = await client.query(
//       `INSERT INTO vendor_onboarding (vendor_id, status)
//        VALUES ($1, 'draft')
//        RETURNING id`,
//       [vendorId]
//     );

//     await client.query("COMMIT");

//     otpStore.delete(email);
//     otpStore.delete(phone);

//     res.json({
//       message: "Registered successfully",
//       onboarding_id: onboarding.rows[0].id,
//     });

//   } catch (err) {
//     await client.query("ROLLBACK");
//     res.status(400).json({ message: err.message });
//   } finally {
//     client.release();
//   }
// };

// /* ================= SEND OTP ================= */
// export const sendOtp = async (req, res) => {
//   try {
//     const { email, phone } = req.body;

//     if (!email && !phone) {
//       return res.status(400).json({ message: "Email or phone required" });
//     }

//     // ================= PHONE OTP =================
//     if (phone) {
//       const phoneOtp = Math.floor(100000 + Math.random() * 900000);

//       otpStore.set(phone, {
//         otp: phoneOtp,
//         expires: Date.now() + 5 * 60 * 1000,
//         verified: false,
//       });

//       const message = `Your Kavas verification OTP is ${phoneOtp}. Valid for 5 minutes. Do not share this code.`;

//       await axios.post(
//         "https://www.fast2sms.com/dev/bulkV2",
//         {
//           route: "q",
//           message,
//           language: "english",
//           numbers: phone,
//         },
//         {
//           headers: {
//             authorization: "qaiITA74c3pkzY1HPJmNWtRMGxoDjefdwulE2QsKXUhCbB9yrS4zEjMDpnmBy92iVqd5uCK83JNakgts",
//           },
//         }
//       );
//     }

//     // ================= EMAIL OTP =================
//     if (email) {
//       const emailOtp = Math.floor(100000 + Math.random() * 900000);

//       otpStore.set(email, {
//         otp: emailOtp,
//         expires: Date.now() + 5 * 60 * 1000,
//         verified: false,
//       });

//       await sendEmailOtp(email, emailOtp);
//     }

//     res.json({ message: "OTP sent successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

// /* ================= VERIFY OTP ================= */
// // export const verifyOtp = async (req, res) => {
// //   try {
// //     const { email, phone, emailOtp, phoneOtp } = req.body;

// //     const emailData = otpStore.get(email);
// //     const phoneData = otpStore.get(phone);

// //     if (!emailData || !phoneData) {
// //       return res.status(400).json({ message: "OTP not found" });
// //     }

// //     if (emailData.otp != emailOtp || phoneData.otp != phoneOtp) {
// //       return res.status(400).json({ message: "Invalid OTP" });
// //     }

// //     if (emailData.expires < Date.now() || phoneData.expires < Date.now()) {
// //       return res.status(400).json({ message: "OTP expired" });
// //     }

// //     emailData.verified = true;
// //     phoneData.verified = true;

// //     otpStore.set(email, emailData);
// //     otpStore.set(phone, phoneData);

// //     res.json({ message: "OTP verified" });

// //   } catch (err) {
// //     res.status(500).json({ message: "Verification failed" });
// //   }
// // };

// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, phone, emailOtp, phoneOtp } = req.body;

//     const emailData = email ? otpStore.get(email) : null;
//     const phoneData = phone ? otpStore.get(phone) : null;

//     // ================= CHECK EXISTS =================
//     if (email && !emailData) {
//       return res.status(400).json({ message: "Email OTP not found" });
//     }

//     if (phone && !phoneData) {
//       return res.status(400).json({ message: "Phone OTP not found" });
//     }

//     // ================= VERIFY EMAIL =================
//     if (email) {
//       if (emailData.expires < Date.now()) {
//         return res.status(400).json({ message: "Email OTP expired" });
//       }

//       if (emailData.otp != emailOtp) {
//         return res.status(400).json({ message: "Invalid email OTP" });
//       }

//       emailData.verified = true;
//       otpStore.set(email, emailData);
//     }

//     // ================= VERIFY PHONE =================
//     if (phone) {
//       if (phoneData.expires < Date.now()) {
//         return res.status(400).json({ message: "Phone OTP expired" });
//       }

//       if (phoneData.otp != phoneOtp) {
//         return res.status(400).json({ message: "Invalid phone OTP" });
//       }

//       phoneData.verified = true;
//       otpStore.set(phone, phoneData);
//     }

//     return res.json({ message: "OTP verified successfully" });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Verification failed" });
//   }
// };

import bcrypt from "bcryptjs";
import db from "../config/db.js";
import axios from "axios";
import { sendEmailOtp } from "../utils/emailService.js";

const otpStore = new Map();

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const expires = Date.now() + 5 * 60 * 1000;

    // ================= PHONE OTP =================
    if (phone) {
      const phoneOtp = Math.floor(100000 + Math.random() * 900000);

      const key = `phone:${phone}`;

      otpStore.set(key, {
        otp: phoneOtp,
        expires,
        verified: false,
      });

      const message = `Your Kavas OTP is ${phoneOtp}. Valid for 5 minutes.`;

      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "q",
          message,
          language: "english",
          numbers: phone,
        },
        {
          headers: {
            authorization: "qaiITA74c3pkzY1HPJmNWtRMGxoDjefdwulE2QsKXUhCbB9yrS4zEjMDpnmBy92iVqd5uCK83JNakgts",
          },
        }
      );

      console.log("PHONE OTP:", key, phoneOtp);
    }

    // ================= EMAIL OTP =================
    if (email) {
      const emailOtp = Math.floor(100000 + Math.random() * 900000);

      const key = `email:${email}`;

      otpStore.set(key, {
        otp: emailOtp,
        expires,
        verified: false,
      });

      await sendEmailOtp(email, emailOtp);

      console.log("EMAIL OTP:", key, emailOtp);
    }

    return res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    let { email, phone, otp } = req.body;

    otp = otp ? String(otp).trim() : null;

    // ================= EMAIL =================
    if (email) {
  const key = `email:${email}`;
  const emailData = otpStore.get(key);

  if (!emailData) return res.status(400).json({ message: "Email OTP not found" });
  if (Date.now() > emailData.expires) return res.status(400).json({ message: "Email OTP expired" });

  if (String(emailData.otp) !== otp) {
    return res.status(400).json({ message: "Invalid email OTP" });
  }

  emailData.verified = true;
  otpStore.set(key, emailData);
}

    // ================= PHONE =================
    if (phone) {
  const key = `phone:${phone}`;
  const phoneData = otpStore.get(key);

  if (!phoneData) return res.status(400).json({ message: "Phone OTP not found" });
  if (Date.now() > phoneData.expires) return res.status(400).json({ message: "Phone OTP expired" });

  if (String(phoneData.otp) !== otp) {
    return res.status(400).json({ message: "Invalid phone OTP" });
  }

  phoneData.verified = true;
  otpStore.set(key, phoneData);
}

    return res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};


/* ================= REGISTER VENDOR ================= */
export const registerVendor = async (req, res) => {
  const client = await db.connect();

  try {
    const { email, phone, password, confirmPassword } = req.body;

    if (!password || password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ================= OTP CHECK =================
    if (email) {
      const emailData = otpStore.get(email);
      if (!emailData?.verified) {
        return res.status(400).json({ message: "Email OTP not verified" });
      }
    }

    if (phone) {
      const phoneData = otpStore.get(phone);
      if (!phoneData?.verified) {
        return res.status(400).json({ message: "Phone OTP not verified" });
      }
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendorResult = await client.query(
      `INSERT INTO vendorprofile (
        email, phone, password_hash, email_verified, phone_verified
      )
      VALUES ($1, $2, $3, true, true)
      RETURNING id`,
      [email, phone, hashedPassword]
    );

    const vendorId = vendorResult.rows[0].id;

    const onboarding = await client.query(
      `INSERT INTO vendor_onboarding (vendor_id, status)
       VALUES ($1, 'draft')
       RETURNING id`,
      [vendorId]
    );

    await client.query("COMMIT");

    otpStore.delete(email);
    otpStore.delete(phone);

    return res.json({
      message: "Registered successfully",
      onboarding_id: onboarding.rows[0].id,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Registration failed" });
  } finally {
    client.release();
  }
};