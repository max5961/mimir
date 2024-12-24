import fs from "fs/promises";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { sampleRoot, Topic, TopicIndex } from "../models/TopicModel.js";
import { randomUUID } from "crypto";
import { DataBasePath, DataBaseDir } from "../loadEnv.js";
import { logger } from "phileas";

export const RootTopicName = "$$ROOT";

/*
 * Reads the json file (Topic) and converts it into a TopicIndex object
 * */
async function openDb(): Promise<TopicIndex> {
    const contents = await fs.readFile(DataBasePath, { encoding: "utf-8" });
    const root = JSON.parse(contents) as Topic;

    const buildTopicIndex = (
        root: Topic,
        index: TopicIndex = { topics: {}, questions: {}, root: root },
    ) => {
        if (!index.topics[root.id]) {
            index.topics[root.id] = { parent: null, topic: root };
        }

        root.questions.forEach((question) => {
            index.questions[question.id] = question;
        });

        root.topics.forEach((topic) => {
            index.topics[topic.id] = { topic: topic, parent: root };
            buildTopicIndex(topic, index);
        });

        return index;
    };

    return buildTopicIndex(root);
}

/*
 * Save just the root.  The indexed tree isn't written.
 * */
async function saveDb(root: Topic): Promise<void> {
    const data = JSON.stringify(root, null, 4);
    return await fs.writeFile(DataBasePath, data, { encoding: "utf-8" });
}

/*
 * Checks for/creates a json file to read and write data from.
 * */
function initializeDataBase(): void {
    const rootTopic: Topic = {
        id: randomUUID(),
        name: RootTopicName,
        questions: [],
        topics: [],
    };

    const fileExists = existsSync(DataBasePath);

    if (!fileExists) {
        mkdirSync(DataBaseDir, { recursive: true });
        writeFileSync(DataBasePath, JSON.stringify(rootTopic), {
            encoding: "utf-8",
        });
    }

    if (process.env.NODE_ENV === "development") {
        writeFileSync(DataBasePath, JSON.stringify(sampleRoot), {
            encoding: "utf-8",
        });
    }
}

/*
 * Synchronously gets a pointer to the root so that we have the initialization
 * data before the app first renders.
 * */
function getRootTopic(): Topic {
    const json = readFileSync(DataBasePath, { encoding: "utf-8" });
    const root = JSON.parse(json) as Topic;
    return root;
}

export const DataBase = {
    path: DataBasePath,
    initializeDataBase,
    getRootTopic,
    openDb,
    saveDb,
};
