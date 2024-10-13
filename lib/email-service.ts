import nodemailer from "nodemailer";

async function sendVerificationEmail(email: string, verificationUrl: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",  // Sesuaikan dengan service email Anda
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <p>Anda telah mendaftar menggunakan email ini. Klik tombol di bawah untuk verifikasi email Anda:</p>
      <a href="${verificationUrl}" style="background-color: orange; padding: 10px; color: white; text-decoration: none;">Verifikasi Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export default sendVerificationEmail;
