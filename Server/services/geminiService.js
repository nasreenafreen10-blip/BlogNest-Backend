const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Gemini API key is not configured in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const generateBlogContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(`Write a comprehensive, well-structured blog post about: ${prompt}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`AI Generation Error: ${error.message}`);
  }
};

const summarizeText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(`Summarize the following text concisely: ${text}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`AI Summarization Error: ${error.message}`);
  }
};

module.exports = { generateBlogContent, summarizeText };
