const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Inquiry = require('./models/Inquiry');
const PortfolioInquiry = require('./models/PortfolioInquiry');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
// const io = new Server(server, { cors: { origin: 'https://sajeevan-web-dev.web.app/' } });


app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('✅ A user connected');

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });

  socket.on('error', (err) => {
    console.error('❌ WebSocket Error:', err);
  });
});

// Contact Form API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to Database
    const inquiry = new Inquiry({ name, email, message });
    await inquiry.save();



    // Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'New Contact Form Submission',
      text: `You have a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${inquiry.submittedAt}`
    };


    // Thank You Email to User
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Us!",
      text: `Hi ${name},\n\nThank you for reaching out. We will get back to you soon.\n\nBest Regards,\nYour Company`,
  });

    await transporter.sendMail(mailOptions);

    // Emit Event to Frontend
    io.emit('newInquiry', inquiry);

    res.status(200).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Portfolio Inquiry API
app.post('/api/projectrequest', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Save to Database
    const portfolioInquiry = new PortfolioInquiry({ name, email, message, subject });
    await portfolioInquiry.save();

    // Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'New Project Request Submission',
      text: `You have a new project request:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\nDate: ${portfolioInquiry.submittedAt}`
    };

    // await transporter.sendMail(mailOptions);

    // Emit Event to Frontend
    // io.emit('newPortfolioInquiry', portfolioInquiry);

    res.status(200).json({ success: true, message: 'Your request has been submitted successfully' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
