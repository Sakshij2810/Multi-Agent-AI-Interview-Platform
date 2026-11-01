import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const pdf = new PDFParse({
    data: buffer,
  });

  const result = await pdf.getText();

  return result.text;
};
