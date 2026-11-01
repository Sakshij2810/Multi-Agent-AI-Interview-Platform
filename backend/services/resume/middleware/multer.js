import fs from "fs";
import multer from "multer";

/*
1. Create the uploads folder if it doesn't exist.
   Git doesn't track empty folders, so we create it when needed.

2. Configure Multer:
   - storage   → where and how to save the uploaded file
   - fileFilter → which files are allowed

3. diskStorage has two methods:
   - destination → decides where the file is stored
   - filename    → decides what name the file gets

4. Both destination and filename receive:
   req, file, cb
   - req  → request
   - file → uploaded file information
   - cb   → callback used to tell Multer what to do

5. fileFilter checks the uploaded file.
   Here, we only allow PDF files based on their MIME type.
*/

const uploadPath = "../uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only pdf files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
