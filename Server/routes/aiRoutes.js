const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { generateBlog, summarize } = require('../controllers/aiController');

const router = express.Router();

router.post('/generate-blog', protect, generateBlog);
router.post('/summarize', protect, summarize);

module.exports = router;
