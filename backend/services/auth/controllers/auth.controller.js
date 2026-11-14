import { getAuth } from "firebase-admin/auth";
import crypto from "crypto";

import { app } from "../config/firebase.js";
import User from "../model/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const GoogleAuth = async (req, res) => {
  try {
    const { token } = req.body; // Get Firebase ID token sent by frontend

    const decoded = await getAuth(app).verifyIdToken(token); // Verify token and get authenticated user's data

    // Check if user already exists in database
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    // Create new user if not found
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
      });
    }

    const sessionId = crypto.randomUUID(); // Generate a unique session ID

    // Store user session data in Redis using session ID
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        interviewCoin: user.interviewCoin,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    // Store session ID in HTTP-only cookie
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: true, // when serving over HTTPS - in production generally use - secure: true
      sameSite: "none", // use "strict" in dev | use "none" in prod
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`); // delete from redis
    }

    // clear from cookie
    res.clearCookie("session", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const useInterviewCoins = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    const session = await redis.get(`session:${sessionId}`);
    const sessionData = JSON.parse(session);

    // data from frontend
    const { coins, action } = req.body;

    if (!coins) {
      return res
        .status(400) // (Bad Request) - Invalid/malformed request
        .json({ success: false, message: "Coins are required" });
    }

    // find user
    const user = await User.findById(sessionData.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Not enough coins
    if (user.interviewCoin < coins) {
      return res
        .status(403) // (Forbidden) - Authenticated but not allowed
        .json({ success: false, message: "No enough coins" });
    }

    // Deduct coins from mongodb
    user.interviewCoin -= coins;

    await user.save();

    // Deduct coins from redis
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        interviewCoin: user.interviewCoin,
      }),
      "EX",
      60 * 60 * 24 * 7,
    );

    return res.status(200).json({
      success: true,
      message: "Interview coins updated successfully",
      interviewCoin: user.interviewCoin,
      action,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addInterviewCoins = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const sessionData = JSON.parse(session);
    const { coins } = req.body;

    if (!coins || coins <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid coins are required",
      });
    }

    const user = await User.findById(sessionData.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.interviewCoin += Number(coins);
    await user.save();

    // Update Redis Session
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        interviewCoin: user.interviewCoin,
      }),
      "EX",
      60 * 60 * 24 * 7,
    );

    return res.status(200).json({
      success: true,
      message: "Coins added successfully",
      interviewCoin: user.interviewCoin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
