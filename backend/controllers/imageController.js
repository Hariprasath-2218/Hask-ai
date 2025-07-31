const Image = require('../models/Image');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
      imageUrl,
      isImageToImage: false
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

const generateImageToImage = async (req, res) => {
  try {
    console.log('Starting image-to-image generation');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');

    const { prompt } = req.body;
    const imageFile = req.file;

    if (!prompt || !prompt.trim()) {
      console.log('Error: Prompt is missing or empty');
      return res.status(400).json({ message: 'Prompt is required' });
    }

    if (!imageFile) {
      console.log('Error: Image file is missing');
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!req.user || !req.user._id) {
      console.log('Error: User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user._id;

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error('HUGGINGFACE_API_KEY is not set');
      return res.status(500).json({ message: 'Hugging Face API key not configured' });
    }

    console.log('Generating image-to-image with prompt:', prompt);
    console.log('Image file details:', {
      originalname: imageFile.originalname,
      mimetype: imageFile.mimetype,
      size: imageFile.size
    });

    try {
      console.log('Initializing Gemini model (gemini-2.5-flash) for image analysis...');
      // Use the 'gemini-2.5-flash' model for its vision capabilities
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const imageBase64 = imageFile.buffer.toString('base64');
      const mimeType = imageFile.mimetype;

      console.log('Image converted to base64, size:', imageBase64.length);

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      };

      const GeminiDescriptionPrompt = `Analyze the provided image and the following user instruction. Generate a comprehensive and detailed text prompt that can be used by a text-to-image model to create the modified image. This prompt should describe:
- All key elements and composition from the original image that should be retained.
- The specific modifications, additions, or changes requested by the user.
- Desired style, colors, lighting, and overall aesthetic of the new image.
- Any new elements to be incorporated, described in detail.

User instruction: "${prompt.trim()}"

Make sure the output is a single, coherent, highly descriptive text prompt suitable for a modern text-to-image AI.`;

      console.log('Calling Gemini API to get image modification description...');

      const result = await model.generateContent([GeminiDescriptionPrompt, imagePart]);
      const response = await result.response;
      const modificationDescription = response.text();

      if (!modificationDescription || modificationDescription.trim().length === 0) {
        console.error('Gemini returned an empty or invalid modification description.');
        return res.status(500).json({ message: 'Gemini could not generate a valid modification description.' });
      }

      console.log('Gemini modification description received (truncated):', modificationDescription.substring(0, 200) + '...');

      console.log('Calling Hugging Face API with Gemini\'s description...');

      const hfResponse = await fetch(
        "https://router.huggingface.co/nebius/v1/images/generations",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            response_format: "b64_json",
            prompt: modificationDescription,
            model: "black-forest-labs/flux-dev",
            n: 1,
            size: "1024x1024"
          }),
        }
      );

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        console.error('Hugging Face API error during image generation:', hfResponse.status, hfResponse.statusText, errorText);
        return res.status(500).json({
          message: 'Failed to generate modified image from Hugging Face API',
          details: `HF API Error: ${hfResponse.status} - ${errorText}`
        });
      }

      const hfResult = await hfResponse.json();
      console.log('Hugging Face response received');

      if (!hfResult.data || !hfResult.data[0] || !hfResult.data[0].b64_json) {
        console.error('Unexpected HF API response format:', hfResult);
        return res.status(500).json({ message: 'Invalid response format from image generation API' });
      }

      const base64Image = hfResult.data[0].b64_json;
      const imageUrl = `data:image/png;base64,${base64Image}`;

      console.log('Saving image to database...');

      const image = new Image({
        userId,
        prompt: prompt.trim(), 
        imageUrl,
        isImageToImage: true,
        originalImageName: imageFile.originalname,
        geminiDescription: modificationDescription 
      });

      await image.save();
      console.log('Image-to-image result saved successfully with ID:', image._id);

      res.json({
        message: 'Image modified successfully',
        imageUrl,
        imageId: image._id,
        modificationDescription: modificationDescription.substring(0, 500) + '...' // Truncate for response
      });

    } catch (geminiError) {
      console.error('Gemini API error details:', {
        message: geminiError.message,
        stack: geminiError.stack,
        name: geminiError.name
      });

      if (geminiError.message && geminiError.message.includes('API_KEY')) {
        return res.status(500).json({ message: 'Gemini API key is invalid or not configured properly' });
      }

      if (geminiError.message && geminiError.message.includes('quota')) {
        return res.status(429).json({ message: 'Gemini API quota exceeded. Please try again later.' });
      }

      return res.status(500).json({
        message: 'Failed to process image with Gemini AI',
        details: geminiError.message
      });
    }

  } catch (error) {
    console.error('Image-to-image generation error:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }

    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    res.status(500).json({
      message: 'Failed to generate image-to-image',
      details: error.message
    });
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

module.exports = {
  generateImage,
  generateImageToImage: [upload.single('image'), generateImageToImage],
  getImageHistory
};