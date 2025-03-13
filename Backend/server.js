const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Inquiry = require('./models/Inquiry');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));
  


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
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
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
        to: process.env.NOTIFY_EMAIL, // Your email to receive inquiries
        subject: 'New Contact Form Submission',
        text: `You have a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${inquiry.submittedAt}`
      };

      
      // Emit Event to Frontend
      io.emit('newInquiry', inquiry);
      
    //   await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
