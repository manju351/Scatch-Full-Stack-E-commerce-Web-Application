const SibApiV3Sdk = require("sib-api-v3-sdk");

// Debug
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Loaded ✅" : "Missing ❌");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const sendMail = async ({ to, subject, html }) => {
  console.log("📨 Sending mail via Brevo...");

  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        email: process.env.EMAIL_USER,
        name: "Scatch Store 🛒"
      },
      to: [
        {
          email: to
        }
      ],
      subject: subject,
      htmlContent: html
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Mail sent successfully:", data.messageId);

  } catch (err) {
    console.log("❌ BREVO ERROR:", err.response?.body || err.message);
  }
};

module.exports = sendMail;
