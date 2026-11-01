import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB conneted");
  } catch (error) {
    console.log("DB error ", error);
  }
};
