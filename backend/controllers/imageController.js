const Image = require('../models/Image');

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user._id;

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error('HUGGINGFACE_API_KEY is not set');
      return res.status(500).json({ message: 'API configuration error' });
    }

    console.log('Generating image with prompt:', prompt);

    const response = await fetch(
      "https://router.huggingface.co/nebius/v1/images/generations",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          response_format: "b64_json",
          prompt: prompt.trim(),
          model: "black-forest-labs/flux-dev",
          n: 1,
          size: "1024x1024"
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      
      if (response.status === 401) {
        return res.status(500).json({ message: 'API authentication failed - check your API key' });
      }
      
      if (response.status === 429) {
        return res.status(429).json({ message: 'API rate limit exceeded - please try again later' });
      }
      
      if (response.status === 503) {
        return res.status(503).json({ message: 'Model is currently loading - please try again in a moment' });
      }

      return res.status(500).json({ message: 'Failed to generate image from API' });
    }

    const result = await response.json();

    if (!result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error('Unexpected API response format:', result);
      return res.status(500).json({ message: 'Invalid response format from API' });
    }

    const base64Image = result.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const image = new Image({
      userId,
      prompt: prompt.trim(),
      imageUrl
    });
    
    await image.save();
    console.log('Image saved successfully with ID:', image._id);

    res.json({
      message: 'Image generated successfully',
      imageUrl,
      imageId: image._id
    });

  } catch (error) {
    console.error('Image generation error:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(500).json({ message: 'Network error - please check your connection' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Database validation error' });
    }
    
    res.status(500).json({ message: 'Failed to generate image' });
  }
};

const getImageHistory = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user._id;
    console.log('Fetching image history for user:', userId);

    const images = await Image.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log('Found', images.length, 'images');

    res.json({ images });
  } catch (error) {
    console.error('Failed to fetch image history:', error);
    res.status(500).json({ message: 'Failed to fetch image history' });
  }
};

module.exports = { generateImage, getImageHistory };