const Blog = require('../models/blogModel');
const { generateBlogContent, summarizeText } = require('../services/geminiService');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const blog = await Blog.create({
      title,
      content,
      category,
      author: req.user.id,
      authorName: req.user.name || 'Author'
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateAIBlog = async (req, res) => {
  try {
    const { prompt, category } = req.body;
    const aiContent = await generateBlogContent(prompt);

    const blog = await Blog.create({
      title: `AI Generated: ${prompt}`,
      content: aiContent,
      category: category || 'AI Insights',
      author: req.user.id,
      authorName: 'Gemini AI Assistant'
    });

    res.status(201).json({ message: 'AI blog generated successfully', blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.summarizeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const summary = await summarizeText(blog.content);
    res.json({ title: blog.title, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
