const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const { generateBlogContent, summarizeText } = require('../services/geminiService');

const asTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');

exports.generateBlog = async (req, res) => {
  const topic = asTrimmedString(req.body.topic);
  const category = asTrimmedString(req.body.category) || 'Technology';

  if (!topic || topic.length > 300) {
    return res.status(400).json({ message: 'topic is required and must be at most 300 characters' });
  }

  if (category.length > 100) {
    return res.status(400).json({ message: 'category must be at most 100 characters' });
  }

  try {
    const [aiContent, author] = await Promise.all([
      generateBlogContent(topic),
      User.findById(req.user.id).select('name')
    ]);

    const blog = await Blog.create({
      title: `Guide to ${topic}`,
      content: aiContent,
      category,
      author: req.user.id,
      authorName: author?.name || 'Author'
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(502).json({ error: `AI Generation Error: ${error.message}` });
  }
};

exports.summarize = async (req, res) => {
  const content = asTrimmedString(req.body.content);

  if (!content || content.length > 20000) {
    return res.status(400).json({ message: 'content is required and must be at most 20000 characters' });
  }

  try {
    const summary = await summarizeText(content);
    return res.status(200).json({ summary });
  } catch (error) {
    return res.status(502).json({ error: `AI Summarization Error: ${error.message}` });
  }
};
