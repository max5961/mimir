import { logger } from "tuir";
import { Path } from "../../../root.js";
import { QuestionResponse } from "../../../routes/questions/questionsController.js";
import { NewQuestion } from "./formSlice.js";
import { QuestionModel } from "../../../models/QuestionModel.js";

async function getQuestion(questionID: string): Promise<QuestionResponse.GetQuestion> {
    const response = await fetch(`${Path.Api.Questions}/${questionID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return await response.json();
}

async function postQuestion(
    topicID: string,
    question: NewQuestion,
): Promise<QuestionResponse.PostQuestion> {
    const response = await fetch(`${Path.Api.Questions}/${topicID}/new-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newQuestion: question }),
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    const data = await response.json();

    return data;
}

async function putQuestion({
    topicID,
    question,
    questionID,
}: {
    topicID: string;
    question: QuestionModel;
    questionID: string;
}): Promise<QuestionResponse.PostQuestion> {
    const response = await fetch(
        `${Path.Api.Questions}/${topicID}/edit-question/${questionID}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        },
    );

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    const data = await response.json();

    return data;
}

export default {
    getQuestion,
    postQuestion,
    putQuestion,
};
