import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // This field will store the unique ID of a document from another collection.
      required: true,
      unique: true, // no duplicate values
      index: true, // faster searching
    },

    extractedText: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    // Array of education objects
    education: {
      type: [
        {
          degree: {
            type: String,
            default: "",
          },
          institution: {
            type: String,
            default: "",
          },
          duration: {
            type: String,
            default: "",
          },
          cgpa: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    // Array of project objects
    projects: {
      type: [
        {
          name: {
            type: String,
            default: "",
          },
          description: {
            type: String,
            default: "",
          },
          duration: {
            type: String,
            default: "",
          },
          role: {
            type: String,
            default: "",
          },
          technologies: {
            type: [String],
            default: [],
          },
          responsibilities: {
            type: [String],
            default: [],
          },
          achievements: {
            type: [String],
            default: [],
          },
          url: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    experience: {
      type: [
        {
          title: {
            type: String,
            default: "",
          },
          company: {
            type: String,
            default: "",
          },
          type: {
            type: String,
            default: "",
          },
          duration: {
            type: String,
            default: "",
          },
          responsibilities: {
            type: [String],
            default: [],
          },
          technologies: {
            type: [String],
            default: [],
          },
        },
      ],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestedRole: {
      type: String,
      default: "",
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
