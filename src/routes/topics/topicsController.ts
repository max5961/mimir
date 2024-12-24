import express from "express";
import { DataBase, RootTopicName } from "../../database/DataBase.js";
import { Question, Topic, TopicIndex } from "../../models/TopicModel.js";
import { randomUUID } from "crypto";

type Req = express.Request;
type Res = express.Response;

export type TopicsData = {
    curr: Topic;
    parent: Topic | null;
    root: Topic;
    path: string;
};

function topicNotFound(id: string): { message: string } {
    return { message: `Invalid Topic ID: ${id}` };
}

function questionNotFound(id: string): { message: string } {
    return { message: `Invalid  Question ID: ${id}` };
}

function buildTopicPath(topicIndex: TopicIndex, id: string): string {
    const path: string[] = [];

    let curr: Topic | null = topicIndex.topics[id]!.topic;
    while (curr) {
        path.push(curr.name);
        curr = topicIndex.topics[curr.id].parent;
    }

    if (path.length === 1) return "/";

    return path.reverse().join("/").replace(RootTopicName, "");
}

async function getTopicDataById(id: string): Promise<TopicsData | null> {
    const topicIndex = await DataBase.openDb();

    const topic = topicIndex.topics[id];

    if (!topic) {
        return null;
    }

    return {
        curr: topic.topic,
        parent: topic.parent,
        root: topicIndex.root,
        path: buildTopicPath(topicIndex, id),
    };
}

async function getQuestionDataById(id: string): Promise<Question | null> {
    const topicIndex = await DataBase.openDb();
    const question = topicIndex.questions[id];

    if (!question) {
        return null;
    }

    return question;
}

async function getTopic(req: Req, res: Res): Promise<void> {
    const topicID = req.params.topicID;
    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    res.status(200).json(data);
}

async function postQuestion(req: Req, res: Res): Promise<void> {
    const topicID = req.params.topicID as string;
    const newQuestion = req.body.newQuestion as Question;

    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    newQuestion.id = randomUUID();
    data.curr.questions.push(newQuestion);

    await DataBase.saveDb(data.root);
    res.json(data);
}

async function postTopic(req: Req, res: Res): Promise<void> {
    const topicID = req.params.topicID as string;
    const newTopicName = req.params.topicName as string;

    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    data.curr.topics.push({
        id: randomUUID(),
        name: newTopicName,
        topics: [],
        questions: [],
    });

    await DataBase.saveDb(data.root);
    res.json(data);
}

async function deleteQuestion(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const questionID: string = req.params.questionID;

    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    data.curr.questions = data.curr.questions.filter(
        (question) => question.id !== questionID,
    );

    await DataBase.saveDb(data.root);
    res.json(data);
}

async function deleteSubTopic(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const subTopicID: string = req.params.subTopicID;

    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    data.curr.topics = data.curr.topics.filter((subTopic) => subTopic.id !== subTopicID);

    await DataBase.saveDb(data.root);

    res.json(data);
}

async function putQuestion(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const questionID: string = req.params.questionID;
    const nextQuestion: Question = req.body.nextQuestion;

    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    const question = data.curr.questions.find((question) => question.id === questionID);

    if (!question) {
        res.status(404).json(questionNotFound(questionID));
        return;
    }

    question.question = nextQuestion.question;
    question.answer = nextQuestion.answer;
    question.type = nextQuestion.type;
    question.A = nextQuestion.A;
    question.B = nextQuestion.B;
    question.C = nextQuestion.C;
    question.D = nextQuestion.D;

    await DataBase.saveDb(data.root);
    res.json(data);
}

async function putSubTopic(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const subTopicID: string = req.params.subTopicID;
    const nextName: string = req.body.nextName;

    const data = await getTopicDataById(topicID);

    if (!data) {
        res.status(404).json(topicNotFound(topicID));
        return;
    }

    const subTopic = data.curr.topics.find((subTopic) => subTopic.id === subTopicID);

    if (!subTopic) {
        res.status(404).json(topicNotFound(subTopicID));
        return;
    }

    subTopic.name = nextName;

    await DataBase.saveDb(data.root);
    res.json(data);
}

export default {
    buildTopicPath,
    getTopicDataById,
    getQuestionDataById,
    getTopic,
    postQuestion,
    postTopic,
    deleteQuestion,
    deleteSubTopic,
    putSubTopic,
    putQuestion,
};
