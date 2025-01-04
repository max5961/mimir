import express from "express";
import { DataBase } from "../../database/DataBase.js";
import { QuestionModel } from "../../models/QuestionModel.js";
import { NewQuestion } from "../../views/features/form/formSlice.js";
import createHttpError from "http-errors";
import { randomUUID } from "crypto";
import { TopicResponse } from "../topics/topicsController.js";
import { redirect } from "../../common/redirect.js";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

export namespace QuestionResponse {
    export type GetQuestion = QuestionModel;
    export type PostQuestion = TopicResponse.GetTopicData;
    export type PutQuestion = TopicResponse.GetTopicData;
    export type DeleteQuestion = TopicResponse.GetTopicData;
}

function sendErr(next: Next, questionID: string): void {
    next(
        createHttpError(400, { message: `Question with id '${questionID}' not found.` }),
    );
}

async function getQuestion(req: Req, res: Res, next: Next) {
    const questionID = req.params.questionID as string;
    const fileData = await DataBase.openDb();
    const question = fileData.questions[questionID];
    if (!question) {
        return sendErr(next, questionID);
    }
    res.status(200).json(question);
}

async function postQuestion(req: Req, res: Res, next: Next) {
    // What topic will this question be pushed to
    const topicID = req.params.topicID as string;
    const newQuestion = req.body.newQuestion as NewQuestion;
    const fileData = await DataBase.openDb();
    const topic = fileData.topics[topicID]?.topic;

    if (!topic) {
        return next(
            createHttpError(400, { message: `Topic with id '${topicID}' not found.` }),
        );
    }

    if (!newQuestion) {
        return next(createHttpError(400, { message: `Missing question` }));
    }

    topic.questions.push({
        ...newQuestion,
        id: randomUUID(),
    } as QuestionModel);

    await DataBase.saveDb(fileData.root);

    redirect(req, res, `/api/topics/data/${topicID}`);
}

async function putQuestion(req: Req, res: Res, next: Next) {
    // What topic will this question be pushed to
    const topicID = req.params.topicID as string;
    const questionID = req.params.questionID as string;
    const updatedQuestion = req.body.question as QuestionModel;
    const fileData = await DataBase.openDb();
    const topic = fileData.topics[topicID]?.topic;

    if (!topic) {
        return next(
            createHttpError(400, { message: `Topic with id '${topicID}' not found.` }),
        );
    }

    if (!updatedQuestion) {
        return next(createHttpError(400, { message: `Missing question` }));
    }

    topic.questions = topic.questions.map((question) => {
        return question.id === questionID ? updatedQuestion : question;
    });

    await DataBase.saveDb(fileData.root);

    redirect(req, res, `/api/topics/data/${topicID}`);
}

async function deleteQuestion(req: Req, res: Res, next: Next) {
    const topicID = req.params.topicID as string;
    const questionID = req.params.questionID as string;

    const fileData = await DataBase.openDb();
    const topic = fileData.topics[topicID]?.topic;
    const question = fileData.questions[questionID];

    if (!topic) {
        return next(
            createHttpError(400, { message: `Topic with id '${topicID}' not found.` }),
        );
    }

    if (!question) {
        return next(
            createHttpError(400, {
                message: `Question with id '${questionID}' not found`,
            }),
        );
    }

    topic.questions = topic.questions.filter((question) => question.id !== questionID);

    await DataBase.saveDb(fileData.root);

    redirect(req, res, `/api/topics/data/${topicID}`);
}

export default {
    getQuestion,
    postQuestion,
    putQuestion,
    deleteQuestion,
};
