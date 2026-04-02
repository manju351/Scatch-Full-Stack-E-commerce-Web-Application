const nodemailer = require("nodemailer");

// Debug logs
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

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
  console.log("📨 Attempting to send mail...");

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in environment variables");
    }

    const transporter = createTransporter();

    // ❌ REMOVE THIS (it causes hanging on Render)
    // await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Scatch Store 🛒" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Mail sent successfully:", info.response);

  } catch (err) {
    console.log("❌ EMAIL ERROR FULL:", err);
  }
};

module.exports = sendMail;
