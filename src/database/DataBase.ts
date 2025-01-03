import fs from "fs/promises";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { randomUUID } from "crypto";
import { DataBasePath, DataBaseDir, NodeEnv } from "../env/Env.js";
import { TopicModel } from "../models/TopicModel.js";
import { IndexableFileData } from "./IndexableFileData.js";
import { sampleRoot } from "../models/sampleTopicModel.js";

export const RootTopicName = "$$ROOT";

/*
 * Reads the json file (Topic) and converts it into a TopicIndexModel object
 * */
export async function openDb(): Promise<IndexableFileData> {
    const contents = await fs.readFile(DataBasePath, { encoding: "utf-8" });
    const root = JSON.parse(contents) as TopicModel;

    const buildIndex = (
        root: TopicModel,
        index: IndexableFileData = { topics: {}, questions: {}, root: root },
    ) => {
        if (!index.topics[root.id]) {
            index.topics[root.id] = { parent: null, topic: root };
        }

        root.questions.forEach((question) => {
            index.questions[question.id] = question;
        });

        root.subTopics.forEach((subTopic) => {
            index.topics[subTopic.id] = { topic: subTopic, parent: root };
            buildIndex(subTopic, index);
        });

        return index;
    };

    return buildIndex(root);
}

/*
 * Save just the root.  The indexed tree isn't written.
 * */
export async function saveDb(root: TopicModel): Promise<void> {
    const data = JSON.stringify(root, null, 4);
    return await fs.writeFile(DataBasePath, data, { encoding: "utf-8" });
}

/*
 * Checks for/creates a json file to read and write data from.
 * */
export function initializeDataBase(): void {
    const rootTopic: TopicModel = {
        id: randomUUID(),
        name: RootTopicName,
        questions: [],
        subTopics: [],
    };

    const fileExists = existsSync(DataBasePath);

    if (!fileExists) {
        mkdirSync(DataBaseDir, { recursive: true });
        writeFileSync(DataBasePath, JSON.stringify(rootTopic), {
            encoding: "utf-8",
        });
    }

    if (NodeEnv === "development") {
        writeFileSync(DataBasePath, JSON.stringify(sampleRoot), {
            encoding: "utf-8",
        });
    }
}

/*
 * Synchronously gets a pointer to the root so that we have the initialization
 * data before the app first renders.
 * */
export function getRootTopic(): TopicModel {
    const json = readFileSync(DataBasePath, { encoding: "utf-8" });
    const root = JSON.parse(json) as TopicModel;
    return root;
}

class Db {
    //
}

export const DataBase = {
    path: DataBasePath,
    initializeDataBase,
    getRootTopic,
    openDb,
    saveDb,
};
