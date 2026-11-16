const nodemailer = require('nodemailer');

let transporter = null;

// Initialize transporter
const initMailer = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT || 587;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
    console.log(`📧 Mailer configured with SMTP host: ${host}`);
  } else {
    console.log(`ℹ️ SMTP credentials not fully configured in .env. Email notifications will be previewed in console.`);
  }
};

initMailer();

/**
 * Safe email sender that never crashes the caller
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.FROM_EMAIL || '"Elevate Careers" <notifications@elevatecareers.io>';

  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(`📨 Email sent to ${to} [ID: ${info.messageId}]`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`\n================= 📨 MOCK EMAIL NOTIFICATION =================`);
      console.log(`TO: ${to}`);
      console.log(`FROM: ${from}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(`PREVIEW: ${text || subject}`);
      console.log(`============================================================\n`);
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error(`⚠️ Email delivery failed to ${to}:`, error.message);
    // Never rethrow - preserve application and caller flow
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
};
