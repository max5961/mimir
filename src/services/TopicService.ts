import { logger } from "phileas";
import { DataBase, RootTopicName } from "../database/DataBase.js";
import { IndexableFileData } from "../database/IndexableFileData.js";
import { TopicModel } from "../models/TopicModel.js";

export type TopicData = {
    currentPath: string;
    currentTopic: TopicModel;
    parentTopic: TopicModel | null;
    rootTopic: TopicModel;
};

async function getTopicDataById(id: string): Promise<TopicData | null> {
    const indexableFileData = await DataBase.openDb();

    const index = indexableFileData.topics[id];

    if (!index || !index.topic) {
        return null;
    }

    const getTopicPath = (data: IndexableFileData, id: string): string => {
        const path: string[] = [];

        let curr: TopicModel | null = data.topics[id]!.topic;
        while (curr) {
            path.push(curr.name);
            curr = data.topics[curr.id].parent;
        }

        if (path.length === 1) return "/";

        return path.reverse().join("/").replace(RootTopicName, "");
    };

    return {
        rootTopic: indexableFileData.root,
        currentTopic: index.topic,
        parentTopic: index.parent,
        currentPath: getTopicPath(indexableFileData, id),
    };
}

async function getIndexableFileData(): Promise<IndexableFileData> {
    const indexableFileData = await DataBase.openDb();
    return indexableFileData;
}

async function getTopicById(id: string): Promise<TopicModel | null> {
    const indexableFileData = await DataBase.openDb();
    const index = indexableFileData.topics[id];
    return index?.topic ?? null;
}

async function getParentTopicById(id: string): Promise<TopicModel | null> {
    const indexableFileData = await DataBase.openDb();
    const index = indexableFileData.topics[id];
    return index?.parent ?? null;
}

export default {
    getTopicDataById,
    getTopicById,
    getParentTopicById,
    getIndexableFileData,
};
