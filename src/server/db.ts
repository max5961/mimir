import fs from "fs/promises";
import { execFileSync } from "child_process";
import path from "path";
import os from "os";
import { Topic, TreeIndex } from "./model.js";

const DB_DIR = path.join(os.homedir(), ".local", "share", "quiz");
const DB_PATH = path.join(DB_DIR, "quizData.json");

function createDataBase(): void {
    execFileSync("mkdir", ["-p", DB_DIR]);
    execFileSync("touch", [DB_PATH]);
}

/*
 * Reads the json file, but converts it into an object that indexes pointers to
 * different locations in the tree.
 * */
async function openDb(): Promise<TreeIndex> {
    const contents = await fs.readFile(DB_PATH, { encoding: "utf-8" });
    const root = JSON.parse(contents) as Topic[];

    const buildTreeIndex = (
        root: Topic[],
        pointers: TreeIndex["pointers"] = { topics: {}, questions: {} },
    ): TreeIndex => {
        root.forEach((topic) => {
            pointers.topics[topic.id] = topic;

            topic.questions.forEach((question) => {
                pointers.questions[question.id] = question;
            });

            buildTreeIndex(topic.topics, pointers);
        });

        return {
            root: root,
            pointers: pointers,
        };
    };

    return buildTreeIndex(root);
}

/*
 * Save just the root.  The indexed tree isn't written.
 * */
async function saveDb(root: Topic[]): Promise<void> {
    const data = JSON.stringify(root, null, 4);
    return await fs.writeFile(DB_PATH, data, { encoding: "utf-8" });
}

export const DB = {
    path: DB_PATH,
    createDataBase,
    openDb,
    saveDb,
};
