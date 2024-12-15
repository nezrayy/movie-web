import nodemailer from "nodemailer";

export const sendSuspensionEmail = async (email: string) => {
  // Konfigurasi transporter untuk mengirim email
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Atau ganti dengan layanan email lain yang Anda gunakan
    auth: {
      user: process.env.EMAIL_USER, // Email pengirim
      pass: process.env.EMAIL_PASS, // Password atau App Password email pengirim
    },
  });

  // Konfigurasi email
  const mailOptions = {
    from: '"rewatch.', // Ganti dengan nama aplikasi Anda
    to: email,
    subject: "Your Account Has Been Suspended",
    text: "Dear User,\n\nWe are notifying you that your account has been suspended. Please contact support for more information.\n\nRegards,\nrewatch Team Support",
  };

  try {
    // Kirim email
    await transporter.sendMail(mailOptions);
    console.log(`Suspension email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
