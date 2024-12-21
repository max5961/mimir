import express from "express";
import { DB } from "../db.js";
import { AnyQuestionType, Topic, TreeIndex } from "../model.js";
import { randomUUID } from "crypto";
import assert from "assert";

type Req = express.Request;
type Res = express.Response;

async function getTopic(
    id: string,
): Promise<{ topic: Topic; treeIndex: TreeIndex }> {
    const treeIndex = await DB.openDb();

    const topic = treeIndex.pointers.topics[id];

    if (!topic) {
        throw new Error("Invalid topic id");
    }

    return { topic, treeIndex };
}

/* Sends Topic */
async function getPage(req: Req, res: Res): Promise<void> {
    const topicID = req.params.topicID;
    const topic = await getTopic(topicID);

    res.json(topic);
}

/* Sends Topic */
async function postQuestion(req: Req, res: Res): Promise<void> {
    const topicID = req.params.topicID as string;
    const newQuestion = req.body.newQuestion as AnyQuestionType;

    const { topic, treeIndex } = await getTopic(topicID);

    newQuestion.id = randomUUID();
    topic.questions.push(newQuestion);

    await DB.saveDb(treeIndex.root);

    res.json({ question: newQuestion });
}

/* Sends Topic */
async function postTopic(req: Req, res: Res): Promise<void> {
    const topicID = req.params.topicID as string;
    const newTopicName = req.params.topicName as string;

    const { topic, treeIndex } = await getTopic(topicID);

    topic.topics.push({
        id: randomUUID(),
        name: newTopicName,
        topics: [],
        questions: [],
    });

    await DB.saveDb(treeIndex.root);

    res.json(topic);
}

/* Sends Topic */
async function deleteQuestion(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const questionID: string = req.params.questionID;

    const { topic, treeIndex } = await getTopic(topicID);

    topic.questions = topic.questions.filter(
        (question) => question.id !== questionID,
    );

    await DB.saveDb(treeIndex.root);

    res.json(topic);
}

/* Sends Topic */
async function deleteTopic(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const subTopicID: string = req.params.subTopicID;

    const { topic, treeIndex } = await getTopic(topicID);

    topic.topics = topic.topics.filter((topic) => topic.id !== subTopicID);

    await DB.saveDb(treeIndex.root);

    res.json(topic);
}

/* Sends Topic */
async function putQuestion(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const questionID: string = req.params.questionID;
    const nextQuestion: AnyQuestionType = req.body.nextQuestion;

    const { topic, treeIndex } = await getTopic(topicID);

    const editQuestion = treeIndex.pointers.questions[questionID];
    assert(editQuestion);

    editQuestion.question = nextQuestion.question;
    editQuestion.answer = nextQuestion.answer;
    editQuestion.type = nextQuestion.type;
    editQuestion.A = nextQuestion.A;
    editQuestion.B = nextQuestion.B;
    editQuestion.C = nextQuestion.C;
    editQuestion.D = nextQuestion.D;

    await DB.saveDb(treeIndex.root);

    res.json(topic);
}

/* Sends Topic */
async function putTopic(req: Req, res: Res): Promise<void> {
    const topicID: string = req.params.topicID;
    const subTopicID: string = req.params.subTopicID;
    const nextName: string = req.body.nextName;

    const { topic, treeIndex } = await getTopic(topicID);

    const editTopic = treeIndex.pointers.topics[subTopicID];
    assert(editTopic);

    editTopic.name = nextName;

    await DB.saveDb(treeIndex.root);

    res.json(topic);
}

export default {
    getPage,
    postQuestion,
    postTopic,
    deleteQuestion,
    deleteTopic,
    putTopic,
    putQuestion,
};
