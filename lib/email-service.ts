import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }: {to: any, subject: any, html: any}) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // email Anda
      pass: process.env.EMAIL_PASS, // password email Anda
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};
