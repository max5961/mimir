import { DataBase } from "./DataBase.js";
import { TopicModel } from "../models/TopicModel.js";
import { RootTopicName } from "./DataBase.js";
import { QuestionModel } from "../models/QuestionModel.js";

export type TopicData = {
    currentPath: string;
    currentTopic: TopicModel;
    parentTopic: TopicModel | null;
    rootTopic: TopicModel;
};

// Makes the entire structure indexable by id
export type IndexableFileData = {
    topics: { [id: string]: { parent: TopicModel | null; topic: TopicModel } };
    questions: { [id: string]: QuestionModel };
    root: TopicModel;
};

class Db {
    async getTopicDataById(id: string): Promise<TopicData | null> {
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
}

export const db = new Db();
