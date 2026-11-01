import mongoose from "mongoose";

// feedbackSchema : these entire fields will be genearted by AI agent
const feedbackSchema = mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
    },

    correctness: {
      type: Number,
      default: 0,
    },

    clarity: {
      type: Number,
      default: 0,
    },

    relevance: {
      type: Number,
      default: 0,
    },

    detail: {
      type: Number,
      default: 0,
    },

    efficiency: {
      type: Number,
      default: 0,
    },

    communication: {
      type: Number,
      default: 0,
    },

    problemSolving: {
      type: Number,
      default: 0,
    },

    creativity: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    improvements: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

// questionSchema
const questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    }, // AI generated

    userAnswer: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    timer: {
      type: Number,
      default: 60,
    },

    feedback: {
      type: feedbackSchema,
      default: () => ({}),
    }, // AI generated
  },
  { _id: false },
);

// interviewSchema
const interviewSchema = mongoose.Schema(
  {
    // basics
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["hr", "technical"],
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    useResume: {
      type: Boolean,
      default: false,
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    // questions array
    questions: {
      type: [questionSchema],
      default: [],
    }, // AI generated

    // report fields - AI generated
    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    summary: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
