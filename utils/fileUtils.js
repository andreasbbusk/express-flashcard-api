import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, "..", "data", filename);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist
    return [];
  }
};

export const writeJsonFile = (filename, data) => {
  const filePath = path.join(__dirname, "..", "data", filename);

  // Create data directory if it doesn't exist
  const dataDir = path.dirname(filePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString);
};

export const generateId = (array) => {
  if (array.length === 0) return 1;
  const ids = array
    .map((item) => item.id)
    .filter((id) => typeof id === "number" && !isNaN(id));
  if (ids.length === 0) return 1;
  const maxId = Math.max(...ids);
  return maxId + 1;
};
