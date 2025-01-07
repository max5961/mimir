import express from "express";
import createHttpError from "http-errors";
import { randomUUID } from "crypto";
import { DataBase } from "../../database/DataBase.js";
import { TopicModel } from "../../models/TopicModel.js";
import { RootTopic } from "../../root.js";
import { db } from "../../database/db.js";
import { redirect } from "../../common/redirect.js";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

export namespace TopicResponse {
    export type GetTopicData = {
        currentPath: string;
        currentTopic: TopicModel;
        parentTopic: TopicModel | null;
    };

    export type GetTopic = TopicModel;
    export type PostTopics = GetTopicData;
    export type MoveTopic = GetTopicData;
    export type DeleteTopic = GetTopicData;
    export type DeleteMany = GetTopicData;
}

const topicDataRoute = (topicID: string) => `/api/topics/data/${topicID}`;

function topicNotFound(id: string): { message: string } {
    return { message: `TopicModel with id '${id}' not found.` };
}

function sendErr(next: Next, topicID: string): void {
    next(createHttpError(400, topicNotFound(topicID)));
}

async function getTopicData(req: Req, res: Res, next: Next): Promise<void> {
    const topicID = req.params.topicID;
    const data = await db.getTopicDataById(topicID);

    if (!data) {
        return next(createHttpError(400, topicNotFound(topicID)));
    }

    const { rootTopic, ...topics } = data;
    res.status(200).json(topics satisfies TopicResponse.GetTopicData);
}

async function getTopic(req: Req, res: Res, next: Next): Promise<void> {
    const topicID = req.params.topicID;
    const topic = await db.getTopicById(topicID);

    if (!topic) {
        return next(createHttpError(400, topicNotFound(topicID)));
    }

    res.status(200).json(topic satisfies TopicResponse.GetTopic);
}

async function postTopics(req: Req, res: Res, next: Next): Promise<void> {
    const topicID = req.params.topicID as string;
    const newTopicNames = req.body.newTopicNames as string[];

    const data = await db.getTopicDataById(topicID);

    if (!data) {
        return next(createHttpError(400, topicNotFound(topicID)));
    }

    const set = new Set<string>();
    data.currentTopic.subTopics.forEach((subTopic) => set.add(subTopic.name));

    for (const newTopicName of new Set(newTopicNames).values()) {
        if (!set.has(newTopicName)) {
            data.currentTopic.subTopics.push({
                id: randomUUID(),
                name: newTopicName,
                subTopics: [],
                questions: [],
            });
        }
    }

    const { rootTopic, ...topics } = data;
    await DataBase.saveTopics(rootTopic);
    res.status(200).json(topics satisfies TopicResponse.PostTopics);
}

async function deleteTopic(req: Req, res: Res, next: Next) {
    const topicID = req.params.topicID as string;
    const subTopicID = req.params.subTopicID as string;

    const data = await DataBase.openTopics();

    const topic = data.topics[topicID]?.topic;

    if (!topic) {
        return next(createHttpError(404, topicNotFound(topicID)));
    }

    topic.subTopics = topic.subTopics.filter((subTopic) => subTopic.id !== subTopicID);

    await DataBase.saveTopics(data.root);

    redirect(req, res, topicDataRoute(topicID));
}

async function deleteMany(req: Req, res: Res, next: Next) {
    const topicID = req.params.topicID as string;
    const names = req.body.names as string[];
    const force = req.body.force as boolean;

    const data = await DataBase.openTopics();

    const topic = data.topics[topicID]?.topic;

    if (!topic) {
        return next(createHttpError(404, topicNotFound(topicID)));
    }

    const set = new Set(names);

    topic.subTopics = topic.subTopics.filter((subTopic) => {
        if (force) {
            // Filter subTopic indiscriminately
            return !set.has(subTopic.name);
        } else {
            // Filter subTopics only if they have no content
            return (
                !set.has(subTopic.name) ||
                subTopic.subTopics.length ||
                subTopic.questions.length
            );
        }
    });
    topic.questions = topic.questions.filter((question) => !set.has(question.question));

    await DataBase.saveTopics(data.root);

    redirect(req, res, topicDataRoute(topicID));
}

async function moveTopic(req: Req, res: Res, next: Next): Promise<void> {
    const cwdID = req.params.cwdID as string;
    const subTopicID = req.params.subTopicID as string;
    let dest = req.body.destination as string;

    let startDestID = cwdID;
    if (dest.startsWith("~/") || dest.startsWith("/root/")) {
        startDestID = RootTopic.id;
        dest = dest.replace(/^~\/|^\/root\//, "");
    }

    if (dest.startsWith("./")) {
        dest = dest.replace(/^\.\//, "");
    }

    const fileData = await db.getIndexableFileData();

    const rootTopic = fileData.root;
    const currentTopic = fileData.topics[cwdID]?.topic;
    const parentTopic = fileData.topics[cwdID]?.parent;
    if (!currentTopic) {
        throw new Error("Cant find currentTopic");
    }
    const subTopic = fileData.topics[subTopicID]?.topic;
    if (!subTopic) {
        throw new Error("Can't find subTopic");
    }
    const destTarget = fileData.topics[startDestID]?.topic;
    if (!destTarget) {
        throw new Error("Can't find destTarget");
    }

    let curr: TopicModel = destTarget;
    const path = dest.split("/");
    for (let i = 0; i < path.length; ++i) {
        const name = path[i];

        if (name === "..") {
            const nextCurr = fileData.topics[curr.id].parent;
            if (nextCurr) {
                curr = nextCurr;
                continue;
            } else {
                throw new Error("Invalid file path");
            }
        }

        const nextTopic = curr.subTopics.find((subTopic) => subTopic.name === name);
        if (!nextTopic && i < path.length - 1) {
            return sendErr(next, cwdID);
        } else if (!nextTopic) {
            if (name && name !== ".") {
                subTopic.name = name;
            }

            // cannot move a directory into a subdirectory of itself (mv foo foo)
        } else if (nextTopic.id === subTopic.id) {
            break;
        } else {
            curr = nextTopic;
        }
    }

    // If the current pointer has actually been moved, push into the destination
    // subTopics array.  Otherwise, the name has just been changed which was done
    // in the for loop.
    if (curr !== destTarget) {
        if (!curr.subTopics.find((topic) => topic.name === subTopic.name)) {
            currentTopic.subTopics = currentTopic.subTopics.filter(
                (topic) => topic.id !== subTopicID,
            );
            curr.subTopics.push(subTopic);
        }
    }

    await DataBase.saveTopics(rootTopic);

    const topicData = await db.getTopicDataById(cwdID);

    res.status(200).json({
        currentTopic: currentTopic,
        parentTopic: parentTopic,
        currentPath: topicData?.currentPath ?? "",
    } satisfies TopicResponse.PostTopics);
}

export default {
    getTopicData,
    getTopic,
    postTopics,
    moveTopic,
    deleteTopic,
    deleteMany,
};
