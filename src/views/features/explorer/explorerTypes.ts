import { Question, Topic } from "../../../models/TopicModel.js";
import { TopicsData } from "../../../routes/topics/topicsController.js";
import { useList } from "phileas";

export type SerializableListView = Omit<
    ReturnType<typeof useList>["listView"],
    "_control" | "_setItems"
>;

// export type Preview = Topic | Question | null;

export type ExplorerState = TopicsData & {
    parentTopicIndex: number;
    previewTopic: Topic | null;
    previewQuestion: Question | null;
    showPreview: boolean;
};

export type NewTopic = Omit<Topic, "id">;
