import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_GMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const defaultTemplate = {
  canonical_url: "http://localhost:3000",
  // TODO: Verify credentials
  instagram: "https://www.instagram.com/finiteloop_club_nmamit/",
  facebook: "https://www.facebook.com/FiniteLoopClub.Nmamit/",
  linkedin: "https://www.linkedin.com/showcase/finite-loop-club",
  email: "mailto:finiteloopclub@gmail.com",
  phone: "tel:8197903771",
};

const sendVerificationEmail = async (
  email: string,
  url: string,
  name: string,
  expiry?: number,
) => {
  const html = fs.readFileSync("src/templates/emailVerification.html", "utf-8");
  const template = handlebars.compile(html);
  const htmlToSend = template({
    verify_url: url,
    name: name,
    // TODO: remove expiry hardcode
    expiry_hours: expiry ?? 24,
    ...defaultTemplate,
  });

  try {
    const res = await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Verify your email",
      html: htmlToSend,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

const sendPasswordResetEmail = async (
  email: string,
  url: string,
  name: string,
  expiry?: number,
) => {
  const html = fs.readFileSync("src/templates/passwordReset.html", "utf-8");
  const template = handlebars.compile(html);
  const htmlToSend = template({
    verify_url: url,
    name: name,
    // TODO: remove expiry hardcode
    expiry_hours: expiry ?? 24,
    ...defaultTemplate,
  });

  try {
    const res = await transporter.sendMail({
      from: '"Finite Loop Club" <flc@nmamit.in>',
      to: email,
      subject: "Reset your password",
      html: htmlToSend,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};



export {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
