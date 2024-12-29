import express from "express";
import { DataBase } from "../../database/DataBase.js";
import { QuestionModel } from "../../models/QuestionModel.js";
import { NewQuestion } from "../../views/features/question/questionFormTypes.js";
import createHttpError from "http-errors";
import { randomUUID } from "crypto";
import { TopicResponse } from "../topics/topicsController.js";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

export namespace QuestionResponse {
    export type GetQuestion = QuestionModel;
    export type PostQuestion = TopicResponse.GetTopicData;
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
        id: randomUUID(),
        ...newQuestion,
    } as QuestionModel);

    await DataBase.saveDb(fileData.root);

    res.redirect(`/api/topics/${topicID}`);
}

export default {
    getQuestion,
    postQuestion,
};
