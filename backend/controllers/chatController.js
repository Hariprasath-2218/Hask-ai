const Chat = require('../models/Chat');
const axios = require('axios');

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // ✅ Updated Groq request
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant', // ✅ Updated model name
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    // ✅ Save the conversation
    const chat = new Chat({
      userId,
      message,
      response: aiResponse
    });
    await chat.save();

    res.json({
      message: 'Message sent successfully',
      response: aiResponse,
      chatId: chat._id
    });
  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to process message',
      error: error.response?.data || error.message
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ chats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

module.exports = { sendMessage, getChatHistory };
