import express from "express";
import {
  addInterviewCoins,
  GoogleAuth,
  logOut,
  useInterviewCoins,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", GoogleAuth);
authRouter.get("/logout", logOut);
authRouter.post("/use-coins", useInterviewCoins);
authRouter.post("/add-coins", addInterviewCoins);

export default authRouter;
