const nodemailer = require("nodemailer");

// Debug logs (keep for now)
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000, // ⏱️ prevent hanging
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

const sendMail = async ({ to, subject, html }) => {
  console.log("📨 Attempting to send mail...");

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing");
    }

    const transporter = createTransporter();

    // ⏱️ Race to prevent infinite hang
    const info = await Promise.race([
      transporter.sendMail({
        from: `"Scatch Store 🛒" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Mail timeout ❌")), 10000)
      )
    ]);

    console.log("✅ Mail sent successfully:", info.response);

  } catch (err) {
    console.log("❌ EMAIL ERROR:", err.message);
  }
};

module.exports = sendMail;
