/*
 upload pdf ----> pdf storage -----> extract stored pdf text -----> 
 llm -----> agent -----> prompt -----> data 
 -----> save data in mongodb -----> set in redis --->  resume data (score, missing skills, recommendation, etc.)
*/

import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agent/resume.agent.js";
import { extractText } from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import fs from "fs";

/*
req.file
   ↓
file.path
   ↓
extractText(file.path)
   ↓
AI analysis
   ↓
JSON.parse()
   ↓
MongoDB create/update
   ↓
Redis cache
   ↓
finally
   ↓
await fs.unlink(file.path)
*/

export const uploadResume = async (req, res) => {
  let file;
  try {
    // get file
    file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume PDF is required" });
    }

    // get userId from headers
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    // get resume text -> then pass it to resume llm agent
    const resumeText = await extractText(file.path);
    const aiResponse = await resumeAgent(resumeText); // string response

    const resumeData = JSON.parse(aiResponse);

    let resume = await Resume.findOne({ userId });

    // resume found -> update resume data : else -> create new resume data
    if (resume) {
      Object.assign(resume, {
        ...resumeData,
        extractedText: resumeText,
      });

      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        extractedText: resumeText,
        ...resumeData,
      });
    }

    // set resumeData in redis
    await redis.set(`resume:${userId}`, JSON.stringify(resume));

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    // delete uploaded pdf
    if (file?.path) {
      await fs.unlink(file.path).catch(() => {}); // catch(() => {}) : Delete the temporary PDF; if it's already gone or deletion fails, don't let cleanup throw another error.
    }
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    const cacheKey = `resume:${userId}`;
    //  redis - check data is available in redis, if yes return data
    const cache = await redis.get(cacheKey);

    if (cache) {
      return res
        .status(200)
        .json({ success: true, data: JSON.parse(cache), source: "redis" });
    }

    // mongodb - check data is available in mongodb, if yes return data
    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    // set founded resume data in redix
    await redis.set(cacheKey, JSON.stringify(resume));

    return res.status(200).json({
      success: true,
      source: "mongoDb",
      data: resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
