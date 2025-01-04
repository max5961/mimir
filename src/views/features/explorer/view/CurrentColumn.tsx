import React, { useEffect, useRef } from "react";
import { useList, useKeymap, Text, Box, List } from "tuir";
import { TopicModel } from "../../../../models/TopicModel.js";
import { QuestionModel } from "../../../../models/QuestionModel.js";
import { Colors } from "../../../globals.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { EStyles } from "./style.js";
import TopicListItem from "./TopicListItem.js";
import QuestionListItem from "./QuestionListItem.js";
import * as Slice from "../explorerSlice.js";
import * as CliSlice from "../../cli/cliSlice.js";

export default function CurrentColumn(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { currentTopic, currentPath, parentID, idxTrail } = useAppSelector(
        Slice.Selectors.CurrentColumn,
    );

    const topicsCount = currentTopic.subTopics.length ?? 0;
    const questionsCount = currentTopic.questions.length ?? 0;
    const itemsCount = topicsCount + questionsCount;

    const { listView, control } = useList(itemsCount);

    const nextTopic: TopicModel | null =
        currentTopic.subTopics[control.currentIndex] ?? null;
    const nextQuestion: QuestionModel | null =
        currentTopic.questions[control.currentIndex - topicsCount] ?? null;

    useEffect(() => {
        dispatch(Slice.Actions.updateCurrentIndex(control.currentIndex));
    }, [control.currentIndex]);

    const pendingGoToIndex = useRef<number | undefined>(0);
    useEffect(() => {
        control.goToIndex(pendingGoToIndex.current ?? 0);
    }, [currentTopic.id]);

    useEffect(() => {
        dispatch(
            Slice.Actions.updateNextColumn({
                nextTopic,
                nextQuestion,
            }),
        );
    }, [control.currentIndex, currentTopic]);

    const { useEvent } = useKeymap({
        prevTopic: [{ input: "h" }, { key: "left" }, { key: "delete" }],
        nextTopic: [{ input: "l" }, { key: "right" }],
        delete: { input: "dd" },
    });

    useEvent("prevTopic", () => {
        if (parentID) {
            const nextTrail = idxTrail.slice();
            pendingGoToIndex.current = nextTrail.pop();

            dispatch(
                Slice.Actions.getPrevTopicData({
                    topicID: parentID,
                    idxTrail: nextTrail,
                }),
            );
        }
    });

    useEvent("nextTopic", () => {
        const nextTopic = currentTopic.subTopics[control.currentIndex] ?? null;
        if (nextTopic) {
            dispatch(
                Slice.Actions.getNextTopicData({
                    topicID: nextTopic.id,
                    idxTrail: [...idxTrail, control.currentIndex],
                }),
            );
            pendingGoToIndex.current = 0;
        }
    });

    useEvent("delete", () => {
        if (nextQuestion) {
            return dispatch(
                Slice.Actions.deleteQuestion({
                    topicID: currentTopic.id,
                    questionID: nextQuestion.id,
                }),
            );
        }

        if (nextTopic) {
            if (nextTopic.subTopics.length || nextTopic.questions.length) {
                return dispatch(
                    CliSlice.Actions.setMessage([
                        "REJECT",
                        `Topic '${nextTopic.name}' is not empty.  Use 'delete --force or -f' to remove`,
                        false,
                    ]),
                );
            }

            return dispatch(
                Slice.Actions.deleteTopic({
                    topicID: currentTopic.id,
                    subTopicID: nextTopic.id,
                }),
            );
        }
    });

    let title = currentPath;
    if (nextTopic?.name) {
        if (title.endsWith("/")) {
            title += nextTopic.name;
        } else {
            title += "/" + nextTopic.name;
        }
    }

    return (
        <Box
            styles={EStyles.ColumnBox}
            titleTopLeft={{ title: title, color: Colors.Primary }}
        >
            {!itemsCount && <Text>Add some topics/questions</Text>}
            {!!itemsCount && (
                <List listView={listView} scrollbar={{ color: Colors.Primary }}>
                    {currentTopic.subTopics.map((topic, idx) => {
                        const isFocus = control.currentIndex === idx;
                        return (
                            <TopicListItem
                                key={topic.id}
                                topic={topic}
                                isFocus={isFocus}
                            />
                        );
                    })}
                    {currentTopic.questions.map((question, idx) => {
                        const isFocus =
                            idx === control.currentIndex - currentTopic.subTopics.length;
                        return (
                            <QuestionListItem
                                key={question.id}
                                question={question}
                                isFocus={isFocus}
                            />
                        );
                    })}
                </List>
            )}
        </Box>
    );
}
