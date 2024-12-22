import fs from "fs/promises";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import os from "os";
import { sampleRoot, Topic, TreeIndex } from "./model.js";
import { randomUUID } from "crypto";
import assert from "assert";

export const DB_DIR = path.join(os.homedir(), ".local", "share", "quiz");
export const DB_PATH = path.join(DB_DIR, "quizData.json");
export const ROOT_NAME = "$$ROOT";

function createDataBase(opts = { sample: false }): void {
    const rootTopic: Topic[] = [
        {
            id: randomUUID(),
            name: ROOT_NAME,
            questions: [],
            topics: [],
        },
    ];

    const fileExists = existsSync(DB_PATH);

    if (!fileExists) {
        mkdirSync(DB_DIR, { recursive: true });
        writeFileSync(DB_PATH, JSON.stringify(rootTopic), {
            encoding: "utf-8",
        });
    }

    if (opts.sample) {
        writeFileSync(DB_PATH, JSON.stringify(sampleRoot), {
            encoding: "utf-8",
        });
    }
}

function getRootTopic(): Topic {
    const json = readFileSync(DB_PATH, { encoding: "utf-8" });
    const data = JSON.parse(json) as Topic[];
    assert(data[0]);
    return data[0];
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
    getRootTopic,
    openDb,
    saveDb,
};
