import "dotenv/config";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export function mail(email, token) {
  const from = process.env.EMAIL_FROM;
  const baseURL = process.env.BASE_URL;

  const mailOption = {
    to: email,
    from: from,
    subject: "Welcome!",
    html: `To confirm your email please click on the <a href='http://localhost:3000/users/verify/${token}'>link</a>`,
    text: `To confirm your email please open the link http://localhost:3000/users/verify/${token}`,
  };

  return transport.sendMail(mailOption);
}
