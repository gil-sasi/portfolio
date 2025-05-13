import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Accessing the email from .env.local
      pass: process.env.EMAIL_PASS, // Accessing the password from .env.local
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sending from the same email
    to: email,
    subject: "Password Reset Request",
    html: `<p>We received a request to reset your password. Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
