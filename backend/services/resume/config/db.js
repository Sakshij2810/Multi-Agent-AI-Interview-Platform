import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected DB");
  } catch (error) {
    console.log("DB error", error);
  }
};
