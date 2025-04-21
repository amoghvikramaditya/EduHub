const express = require("express");
const Question = require("../models/Question");
const Reply = require("../models/Reply");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Get a single question with replies
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const replies = await Reply.find({ question: question._id })
      .populate("author", "username")
      .sort({ createdAt: 1 });

    res.json({ question, replies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching question" });
  }
});

// Create a new question
router.post("/questions", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const question = new Question({
      title,
      content,
      tags,
      author: req.user._id,
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Error creating question" });
  }
});

// Add a reply to a question
router.post("/questions/:id/replies", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const reply = new Reply({
      content,
      author: req.user._id,
      question: question._id,
    });
    await reply.save();

    question.replies.push(reply._id);
    await question.save();

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: "Error creating reply" });
  }
});

module.exports = router;
