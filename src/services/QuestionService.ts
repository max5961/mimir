import { DataBase } from "../database/DataBase.js";
import { QuestionModel } from "../models/QuestionModel.js";

async function getQuestionDataById(id: string): Promise<QuestionModel | null> {
    const indexableFileData = await DataBase.openDb();
    const question = indexableFileData.questions[id];

    if (!question) {
        return null;
    }

    return question;
}

export default {
    getQuestionDataById,
};
