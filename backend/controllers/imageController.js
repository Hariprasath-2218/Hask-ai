const Image = require('../models/Image');
const axios = require('axios');

console.log('Using HuggingFace API Key:', process.env.HUGGINGFACE_API_KEY);

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user._id;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        inputs: prompt,
        options: {
          wait_for_model: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      }
    );

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const image = new Image({
      userId,
      prompt,
      imageUrl
    });
    await image.save();

    res.json({
      message: 'Image generated successfully',
      imageUrl,
      imageId: image._id
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ message: 'Failed to generate image' });
  }
};

const getImageHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const images = await Image.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ images });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch image history' });
  }
};

module.exports = { generateImage, getImageHistory };