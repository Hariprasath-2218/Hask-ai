const express = require('express');
const { generateImage, generateImageToImage, getImageHistory } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', authMiddleware, generateImage);
router.post('/generate-image-to-image', authMiddleware, generateImageToImage);
router.get('/history', authMiddleware, getImageHistory);

module.exports = router;