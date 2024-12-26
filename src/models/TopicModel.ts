import { QuestionModel } from "./QuestionModel.js";

export type TopicModel = {
    id: string;
    name: string;
    questions: QuestionModel[];
    subTopics: TopicModel[];
};
