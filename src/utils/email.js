const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

const sendVerificationEmail = async (email, userId) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${userId}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Vérifiez votre adresse e-mail',
    html: `Cliquez sur ce lien pour vérifier votre adresse e-mail : <a href="${verificationLink}">${verificationLink}</a>`,
  });
};

const sendPasswordResetEmail = async (email, userId) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${userId}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a>`,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };