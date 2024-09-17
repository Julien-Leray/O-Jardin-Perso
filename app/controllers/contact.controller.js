import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const contact = (req, res) => {
  const { email, message } = req.body;
  console.log(email, message);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ojardinojardin@gmail.com',
      pass: process.env.GMAILPASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: 'ojardinojardin@gmail.com',
    subject: 'Contact',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent' });
    }
  });
};

export default contact;

