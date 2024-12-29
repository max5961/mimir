import { QuestionModel } from "../../../models/QuestionModel.js";

export type NewQuestion = Omit<QuestionModel, "id">;
