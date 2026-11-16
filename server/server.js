require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  sessionName: { type: String, required: true, trim: true },
  answers: {
    type: [answerSchema],
    validate: {
      validator: (answers) => answers.length === 5,
      message: "Exactly five answers are required."
    }
  },
  submittedAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Experiment 5 Feedback API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected"
  });
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { studentName, department, sessionName, answers } = req.body;

    if (!studentName?.trim() || !department?.trim() || !sessionName?.trim()) {
      return res.status(400).json({ message: "Student name, department and session name are required." });
    }
    if (!Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ message: "Please submit answers to exactly five questions." });
    }
    if (answers.some((item) => !item.question || !item.answer?.toString().trim())) {
      return res.status(400).json({ message: "Please answer all five questions." });
    }

    const feedback = await Feedback.create({
      studentName,
      department,
      sessionName,
      answers
    });

    res.status(201).json({
      message: "Feedback submitted and stored in MongoDB successfully.",
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Error storing feedback." });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ message: "Error retrieving feedback." });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Create server/.env using .env.example.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start backend:", error.message);
    process.exit(1);
  }
}

startServer();
