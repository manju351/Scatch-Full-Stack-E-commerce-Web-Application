const nodemailer = require("nodemailer");

// Debug (remove after testing)
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
console.log("📨 Attempting to send mail...");
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendMail = async ({ to, subject, html }) => {
  try {
    // ✅ Check env first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in environment variables");
    }

    const transporter = createTransporter();

    // ✅ Verify connection (very important)
    await transporter.verify();
    console.log("Mail server ready ✅");

    const info = await transporter.sendMail({
      from: `"Scatch Store 🛒" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("Mail sent successfully ✅:", info.response);

  } catch (err) {
    console.log("❌ EMAIL ERROR FULL:", err); // full error, not just message
  }
};

module.exports = sendMail;
