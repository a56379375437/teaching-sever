import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { marked } from "marked";

export const getREADMEModel = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename); //当前文件所在目录
    const readmePath = join(__dirname, "../../README.md");
    const readmeContent = await fs.readFile(readmePath, "utf8");
    const html = marked.parse(readmeContent);
    return html;
  } catch (error) {
    throw new Error("Error reading README.md file" + error);
  }
};
