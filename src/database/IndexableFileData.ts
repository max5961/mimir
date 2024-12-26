import { TopicModel } from "../models/TopicModel.js";
import { QuestionModel } from "../models/QuestionModel.js";

// Makes the entire structure indexable by id
export type IndexableFileData = {
    topics: { [id: string]: { parent: TopicModel | null; topic: TopicModel } };
    questions: { [id: string]: QuestionModel };
    root: TopicModel;
};
