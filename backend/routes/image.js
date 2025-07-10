const express = require('express');
const { generateImage, getImageHistory } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', authMiddleware, generateImage);
router.get('/history', authMiddleware, getImageHistory);

module.exports = router;