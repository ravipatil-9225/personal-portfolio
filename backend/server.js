require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/raviraj_portfolio';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected to', MONGO_URI))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// API Endpoints
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const newContact = new Contact({ name, email, subject: subject || 'No Subject', message });
        await newContact.save();

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
