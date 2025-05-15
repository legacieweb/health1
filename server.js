const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow cross-origin from frontend
app.use(express.json()); // Parse JSON bodies

// POST route to handle bookings
app.post('/api/book', async (req, res) => {
  const { name, email, service, date, time, message } = req.body;

  if (!name || !email || !service || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iyonicorp@gmail.com',
      pass: 'dikfirjarvijwskx' // ✅ You should move this to a .env file
    }
  });

  const mailOptionsUser = {
    from: '"HealthCare Plus" <iyonicorp@gmail.com>',
    to: email,
    subject: `Appointment Confirmation – ${service}`,
    text: `Hi ${name},\n\nYour appointment for "${service}" has been booked:\n📅 ${date}\n🕒 ${time}\n\nWe look forward to serving you.\n\n— HealthCare Plus Team`
  };

  const mailOptionsAdmin = {
    from: '"HealthCare Plus" <iyonicorp@gmail.com>',
    to: 'iyonicorp@gmail.com',
    subject: `📥 New Appointment – ${service}`,
    text: `New Booking Details:\n\n👤 Name: ${name}\n📧 Email: ${email}\n🩺 Service: ${service}\n📅 Date: ${date}\n🕒 Time: ${time}\n📝 Message: ${message || 'None'}`
  };

  try {
    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsAdmin);
    console.log(`📧 Emails sent for ${name}`);
    res.status(200).json({ message: 'Booking confirmed and emails sent.' });
  } catch (err) {
    console.error('❌ Email sending error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at: http://localhost:${port}`);
});
