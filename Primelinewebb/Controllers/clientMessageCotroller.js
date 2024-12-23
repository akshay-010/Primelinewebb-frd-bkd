const ClientMessage = require('../Model/ClientMessageModel');

// Add a new client message
const addClientMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a new message
        const newMessage = new ClientMessage({ name, email, subject, message });
        await newMessage.save();

        res.status(201).json({ message: 'Message added successfully!', data: newMessage });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the message.', details: error.message });
    }
};

// Get all client messages
const getClientMessages = async (req, res) => {
    try {
        const messages = await ClientMessage.find().sort({ createdAt: -1 }); // Sort by latest first
        res.status(200).json({ message: 'Messages retrieved successfully!', data: messages });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving messages.', details: error.message });
    }
};

module.exports = {
    addClientMessage,
    getClientMessages,
};
