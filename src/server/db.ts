import fs from "fs/promises";
import { execFileSync } from "child_process";
import path from "path";
import os from "os";
import { Topic } from "./model.js";

const DB_DIR = path.join(os.homedir(), ".local", "share", "quiz");
const DB_PATH = path.join(DB_DIR, "quizData.json");

function createDataBase(): void {
    execFileSync("mkdir", ["-p", DB_DIR]);
    execFileSync("touch", [DB_PATH]);
}

async function openDb(): Promise<Topic> {
    const contents = await fs.readFile(DB_PATH, { encoding: "utf-8" });
    return JSON.parse(contents) as Topic;
}

async function saveDb(root: Topic): Promise<void> {
    const data = JSON.stringify(root, null, 4);
    return await fs.writeFile(DB_PATH, data, { encoding: "utf-8" });
}

export const DB = {
    path: DB_PATH,
    createDataBase,
    openDb,
    saveDb,
};
