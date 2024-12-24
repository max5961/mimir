import React, { useEffect } from "react";
import { Box, HorizontalLine, List, Styles, Text, useKeymap, useList } from "phileas";
import { useAppDispatch, useAppSelector } from "../../store/store.js";
import {
    selectExplorer,
    updateParentTopicIndex,
    loadTopic,
    selectParentColumn,
    selectCurrentColumn,
    updatePreview,
    selectPreviewColumn,
    updateShowPreview,
} from "./explorerSlice.js";
import { Question, Topic } from "../../../models/TopicModel.js";

const BASE_COLOR = "green";

const stretchBox: Styles["Box"] = {
    height: "100",
    width: "100",
    borderStyle: "round",
    borderColor: BASE_COLOR,
};

export function Explorer(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { topicPath, topicPreview, showPreview } = useAppSelector(selectExplorer);

    const { useEvent } = useKeymap({ togglePreview: { input: "p" } });
    useEvent("togglePreview", () => {
        dispatch(updateShowPreview(!showPreview));
    });

    let currentColumnPath = topicPath;
    if (topicPreview) {
        if (!currentColumnPath.endsWith("/")) {
            currentColumnPath += "/";
        }
        currentColumnPath += topicPreview.name;
    }

    return (
        <Box height="100" width="100" flexDirection="column">
            <Box
                width="100"
                height={3}
                flexShrink={0}
                borderStyle="round"
                borderColor={BASE_COLOR}
            >
                <Text color={BASE_COLOR}>{topicPath}</Text>
            </Box>
            <Box styles={{ ...stretchBox, borderStyle: undefined }}>
                <Box styles={stretchBox} flexShrink={1.25}>
                    <ParentColumn />
                </Box>
                <Box
                    styles={stretchBox}
                    titleTopLeft={{ title: currentColumnPath, color: BASE_COLOR }}
                >
                    <CurrentColumn />
                </Box>
                {showPreview && (
                    <Box styles={stretchBox}>
                        <PreviewColumn />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

function ParentColumn(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { parentTopic, currTopic } = useAppSelector(selectParentColumn);

    const itemsLength =
        (parentTopic?.topics.length ?? 0) + (parentTopic?.questions.length ?? 0);

    const { listView, control } = useList(itemsLength, {
        navigation: "none",
        centerScroll: true,
    });

    useEffect(() => {
        // Shift index to the one that got us here
        if (
            parentTopic &&
            parentTopic.topics[control.currentIndex]?.id !== currTopic.id
        ) {
            for (let i = 0; i < parentTopic.topics.length; ++i) {
                const stepTopic = parentTopic.topics[i];
                if (stepTopic.id === currTopic.id) {
                    if (control.currentIndex !== i) {
                        control.goToIndex(i);
                        dispatch(updateParentTopicIndex(i));
                    }
                }
            }
        }
    }, [parentTopic?.id]);

    // Return dummy root topic if no parent
    if (!parentTopic) {
        return (
            <Box height={1} width="100">
                <TopicListItem
                    topic={{
                        topics: [],
                        questions: [],
                        id: "foobar",
                        name: "root",
                    }}
                    isFocus
                    dim
                />
            </Box>
        );
    }

    return (
        <Box height="100" width="100">
            <List listView={listView} scrollbar={{ color: BASE_COLOR }}>
                {parentTopic.topics.map((topic, idx) => {
                    const isFocus = control.currentIndex === idx;
                    return (
                        <TopicListItem
                            key={topic.id}
                            topic={topic}
                            isFocus={isFocus}
                            dim
                        />
                    );
                })}
                {parentTopic.questions.map((question, idx) => {
                    const isFocus =
                        idx === control.currentIndex - parentTopic.topics.length;
                    return (
                        <QuestionListItem
                            key={question.id}
                            question={question}
                            isFocus={isFocus}
                            dim
                        />
                    );
                })}
            </List>
        </Box>
    );
}

function CurrentColumn(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { current, parent, parentTopicIndex } = useAppSelector(selectCurrentColumn);

    const { listView, control } = useList(
        current.topics.length + current.questions.length,
    );

    const { useEvent } = useKeymap({
        loadNextTopic: [{ input: "l" }, { key: "return" }],
        loadParentTopic: [{ input: "h" }, { key: "backspace" }],
    });

    useEvent("loadNextTopic", () => {
        if (control.currentIndex < current.topics.length) {
            const nextTopic = current.topics[control.currentIndex];

            dispatch(loadTopic(nextTopic.id));
            control.goToIndex(0);
        }
    });

    useEvent("loadParentTopic", () => {
        if (parent) {
            dispatch(loadTopic(parent.id));
            control.goToIndex(parentTopicIndex);
        }
    });

    useEffect(() => {
        // Since topics render first, only one of these can be in range
        const topicsIdx = control.currentIndex;
        const questionsIdx = control.currentIndex - current.topics.length;

        const topicPreview = current.topics[topicsIdx] ?? null;
        const questionPreview = current.questions[questionsIdx] ?? null;

        dispatch(
            updatePreview({
                topicPreview,
                questionPreview,
            }),
        );
    }, [control.currentIndex]);

    return (
        <Box>
            <List listView={listView} scrollbar={{ color: BASE_COLOR }}>
                {current.topics.map((topic, idx) => {
                    const isFocus = control.currentIndex === idx;
                    return (
                        <TopicListItem key={topic.id} topic={topic} isFocus={isFocus} />
                    );
                })}
                {current.questions.map((question, idx) => {
                    const isFocus = idx === control.currentIndex - current.topics.length;
                    return (
                        <QuestionListItem
                            key={question.id}
                            question={question}
                            isFocus={isFocus}
                        />
                    );
                })}
            </List>
        </Box>
    );
}

function PreviewColumn(): React.ReactNode {
    const { topic, question } = useAppSelector(selectPreviewColumn);

    if (!topic && !question) return null;

    const styles: Styles["Box"] = {
        height: "100",
        width: "100",
        flexDirection: "column",
    };

    if (topic) {
        return (
            <Box styles={styles}>
                {topic.topics.map((topic) => {
                    return (
                        <TopicListItem key={topic.id} topic={topic} isFocus={false} dim />
                    );
                })}
                {topic.questions.map((question) => {
                    return (
                        <QuestionListItem
                            key={question.id}
                            question={question}
                            isFocus={false}
                            dim
                        />
                    );
                })}
            </Box>
        );
    }

    if (question) {
        return (
            <Box styles={styles}>
                <Box
                    width="100"
                    borderStyle="round"
                    borderColor="cyan"
                    titleTopLeft={{ title: "Question", color: "cyan" }}
                    flexShrink={0}
                >
                    <Text color="cyan" dimColor>
                        {question.question}
                    </Text>
                </Box>
                <HorizontalLine dimColor color="green" />
                {!question.A && (
                    <Box
                        width="100"
                        borderStyle="round"
                        borderColor="green"
                        titleTopLeft={{
                            title: "Answer",
                            color: "green",
                        }}
                        titleTopRight={{
                            title: question.type === "qi" ? "[input]" : "",
                            color: "green",
                        }}
                        flexShrink={0}
                    >
                        <Text color="green" dimColor>
                            {question.answer}
                        </Text>
                    </Box>
                )}
                {question.A && (
                    <Text
                        color={
                            question.answer.toUpperCase() === "A" ? "green" : undefined
                        }
                    >{`A: ${question.A}`}</Text>
                )}
                {question.B && (
                    <Text
                        color={
                            question.answer.toUpperCase() === "B" ? "green" : undefined
                        }
                    >{`B: ${question.B}`}</Text>
                )}
                {question.C && (
                    <Text
                        color={
                            question.answer.toUpperCase() === "C" ? "green" : undefined
                        }
                    >{`C: ${question.C}`}</Text>
                )}
                {question.D && (
                    <Text
                        color={
                            question.answer.toUpperCase() === "D" ? "green" : undefined
                        }
                    >{`D: ${question.D}`}</Text>
                )}
            </Box>
        );
    }
}

function TopicListItem({
    topic,
    isFocus,
    dim = false,
}: {
    topic: Topic;
    isFocus: boolean;
    dim?: boolean;
}): React.ReactNode {
    let bgColor = isFocus ? "magenta" : undefined;
    if (dim) {
        bgColor = isFocus ? "gray" : undefined;
    }

    const iconColor = isFocus ? undefined : "white";
    const textColor = isFocus ? undefined : BASE_COLOR;

    return (
        <Box width="100" backgroundColor={bgColor} flexShrink={0}>
            <Box height={1} width={2} backgroundColor="inherit" flexShrink={0}>
                <Text color={iconColor} wrap="truncate-end">
                    {"☰ "}
                </Text>
            </Box>
            <Box height={1} backgroundColor="inherit">
                <Text bold color={textColor} wrap="truncate-end">
                    {topic.name}
                </Text>
            </Box>
        </Box>
    );
}

function QuestionListItem({
    question,
    isFocus,
    dim = false,
}: {
    question: Question;
    isFocus: boolean;
    dim?: boolean;
}): React.ReactNode {
    let bgColor = isFocus ? "magenta" : undefined;
    if (dim) {
        bgColor = isFocus ? "gray" : undefined;
    }

    const iconColor = isFocus ? undefined : "white";
    const textColor = isFocus ? undefined : BASE_COLOR;

    return (
        <Box width="100" backgroundColor={bgColor}>
            <Box height={1} width={2} backgroundColor="inherit" flexShrink={0}>
                <Text color={iconColor} wrap="truncate-end">
                    {"∘ "}
                </Text>
            </Box>
            <Box width="100" height={1} backgroundColor="inherit">
                <Text italic dimColor={!isFocus} color={textColor} wrap="truncate-end">
                    {question.question}
                </Text>
            </Box>
        </Box>
    );
}
