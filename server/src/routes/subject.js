const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const youtubeSearch = require("youtube-api-v3-search");
const auth = require("../middleware/auth");
const Subject = require("../models/Subject");
const { getFromCache, writeToCache } = require("../utils/cache");
const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Get all subjects
router.get("/subjects", auth, async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching subjects",
      details: error.message,
    });
  }
});

// Get a single subject
router.get("/subjects/:id", auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }
    res.json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching subject",
      details: error.message,
    });
  }
});

// Generate notes for a subject
router.post("/generate-notes", auth, async (req, res) => {
  try {
    const { subject } = req.body;

    // Check cache first
    const cachedNotes = getFromCache(subject, "notes");
    if (cachedNotes) {
      console.log("Serving notes from cache for:", subject);
      return res.json({
        success: true,
        content: cachedNotes.content,
        fromCache: true,
      });
    }

    const prompt = `Generate comprehensive study notes for ${subject}. Include key concepts, definitions, and examples. Format the response in a clear, structured way with headings and bullet points where appropriate.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cache the response
    writeToCache(subject, "notes", { content: text });

    res.json({
      success: true,
      content: text,
      fromCache: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error generating notes",
      details: error.message,
    });
  }
});

// Generate quiz for a subject
router.post("/generate-quiz", auth, async (req, res) => {
  try {
    const { subject } = req.body;
    console.log("Generating quiz for subject:", subject);

    // Check cache first
    const cachedQuiz = getFromCache(subject, "quiz");
    if (cachedQuiz) {
      console.log("Serving quiz from cache for:", subject);
      return res.json({
        success: true,
        questions: cachedQuiz.questions,
        fromCache: true,
      });
    }

    const prompt = `Generate a quiz with 5 multiple choice questions for ${subject}. For each question, include:
    1. The question text
    2. Four options (A, B, C, D)
    3. The correct answer
    4. A brief explanation of why the answer is correct

    Format the response as a JSON array of questions with the following structure:
    [
      {
        "question": "Question text",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "Correct option letter",
        "explanation": "Explanation text"
      }
    ]`;

    console.log("Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Raw response from Gemini:", text);

    try {
      // Clean up the response text by removing markdown code block formatting
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      console.log("Cleaned response:", cleanText);

      // Parse the cleaned response text as JSON
      const questions = JSON.parse(cleanText);
      console.log("Parsed questions:", questions);

      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }

      // Cache the response
      writeToCache(subject, "quiz", { questions });

      res.json({
        success: true,
        questions,
        fromCache: false,
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      res.status(500).json({
        success: false,
        error: "Error parsing quiz questions",
        details: parseError.message,
        rawResponse: text,
      });
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      success: false,
      error: "Error generating quiz",
      details: error.message,
    });
  }
});

// Search YouTube videos for a subject
router.get("/youtube/search/:query", auth, async (req, res) => {
  try {
    const { query } = req.params;
    const options = {
      q: query,
      part: "snippet",
      type: "video",
      maxResults: 6,
    };

    const response = await youtubeSearch(process.env.YOUTUBE_API_KEY, options);

    const formattedVideos = response.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    res.json({
      success: true,
      items: formattedVideos,
    });
  } catch (error) {
    console.error("YouTube search error:", error);
    res.status(500).json({
      success: false,
      error: "Error searching videos",
      details: error.message,
    });
  }
});

// Create a new subject
router.post("/subjects", auth, async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Check if subject with the same name already exists
    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        error: "A subject with this name already exists",
      });
    }

    const subject = new Subject({
      name,
      description,
      icon,
    });

    await subject.save();

    res.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating subject",
      details: error.message,
    });
  }
});

module.exports = router;
