import { Path } from "../../../root.js";
import { QuestionResponse } from "../../../routes/questions/questionsController.js";

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

export default {
    getQuestion,
};
