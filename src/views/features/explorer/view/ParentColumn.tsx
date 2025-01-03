import React from "react";
import { useList, List, Box } from "tuir";
import { Colors } from "../../../globals.js";
import { useAppSelector } from "../../../store/store.js";
import { EStyles } from "./style.js";
import TopicListItem from "./TopicListItem.js";
import QuestionListItem from "./QuestionListItem.js";
import * as Slice from "../explorerSlice.js";

export default function ParentColumn(): React.ReactNode {
    const { parentTopic, idxTrail } = useAppSelector(Slice.Selectors.ParentColumn);

    const subTopicsLength = parentTopic?.subTopics.length ?? 0;
    const questionsLength = parentTopic?.questions.length ?? 0;
    const itemsLength = subTopicsLength + questionsLength;

    // Will always have at least one parent topic (display dummy root);
    const { listView } = useList(itemsLength ? itemsLength : 1, {
        navigation: "none",
        centerScroll: true,
    });

    const listIndex = idxTrail[idxTrail.length - 1];

    const content = !parentTopic ? (
        <List listView={listView}>
            <TopicListItem
                topic={{
                    subTopics: [],
                    questions: [],
                    id: "root",
                    name: "root",
                }}
                isFocus
                dim
            />
        </List>
    ) : (
        <List listView={listView} scrollbar={{ color: Colors.Primary }}>
            {parentTopic.subTopics.map((topic, idx) => {
                const isFocus = listIndex === idx;
                return (
                    <TopicListItem key={topic.id} topic={topic} isFocus={isFocus} dim />
                );
            })}
            {parentTopic.questions.map((question) => {
                return (
                    <QuestionListItem
                        key={question.id}
                        question={question}
                        isFocus={false}
                        dim
                    />
                );
            })}
        </List>
    );

    return (
        <Box styles={EStyles.ColumnBox} flexShrink={1.25}>
            {content}
        </Box>
    );
}
