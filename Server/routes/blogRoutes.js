const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, generateAIBlog, summarizeBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBlogs).post(protect, createBlog);
router.post('/ai/generate', protect, generateAIBlog);
router.get('/:blogId/summarize', protect, summarizeBlog);

module.exports = router;
