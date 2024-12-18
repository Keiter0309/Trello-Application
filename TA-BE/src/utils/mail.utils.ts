import nodemailer from "nodemailer";
import { config } from "dotenv";

// Load environment variables
config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    2;
    console.error("Error sending email:", error);
  }
};
