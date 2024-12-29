import { useList } from "phileas";
import { TopicResponse } from "../../../routes/topics/topicsController.js";
import { TopicModel } from "../../../models/TopicModel.js";
import { QuestionModel } from "../../../models/QuestionModel.js";

export type SerializableListView = Omit<
    ReturnType<typeof useList>["listView"],
    "_control" | "_setItems"
>;

export type ExplorerState = {
    idxTrail: number[];
    currentIndex: number;
    topicData: TopicResponse.GetTopicData;
    nextColumn: {
        nextTopic: TopicModel | null;
        nextQuestion: QuestionModel | null;
        showNextColumn: boolean;
    };
};
