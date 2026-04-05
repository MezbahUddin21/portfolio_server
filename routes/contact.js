const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

const mailHost = process.env.MAIL_HOST || process.env.EMAIL_HOST;
const mailPort = Number(process.env.MAIL_PORT || process.env.EMAIL_PORT || 587);
const mailSecure = (process.env.MAIL_SECURE || process.env.EMAIL_SECURE || 'false') === 'true';
const mailUser = process.env.MAIL_USER || process.env.EMAIL_USER;
const mailPass = process.env.MAIL_PASS || process.env.EMAIL_PASS;
const mailTo = process.env.MAIL_TO || process.env.EMAIL_TO;
const mailFrom = process.env.MAIL_FROM || process.env.EMAIL_FROM || (mailUser ? `Portfolio Contact <${mailUser}>` : undefined);

const mailTransporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort,
  secure: mailSecure,
  auth: mailUser && mailPass ? { user: mailUser, pass: mailPass } : undefined,
  tls: { rejectUnauthorized: false },
});

mailTransporter.verify((error, success) => {
  if (error) {
    console.warn('Mail transporter verify error:', error);
  } else {
    console.log('Mail transporter is ready to send messages');
  }
});

// Get all contacts (for admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Send contact message
router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    if (!mailHost || !mailUser || !mailPass || !mailTo) {
      return res.status(201).json({
        message: 'Message saved, but email delivery is not configured. Please set MAIL_HOST, MAIL_USER, MAIL_PASS, and MAIL_TO (or their EMAIL_* equivalents) in server/.env.',
      });
    }

    const mailOptions = {
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `New message from ${name} <${email}>:\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>`,
    };

    await mailTransporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact send error:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message || error });
  }
});

module.exports = router;
