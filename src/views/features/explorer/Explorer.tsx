import React, { useEffect, useRef } from "react";
import {
    Box,
    HorizontalLine,
    List,
    logger,
    Styles,
    Text,
    useKeymap,
    useList,
} from "phileas";
import { useAppDispatch, useAppSelector } from "../../store/store.js";
import {
    getNextTopicData,
    getPrevTopicData,
    getTopicData,
    selectCurrentColumn,
    selectNextColumn,
    selectParentColumn,
    selectTopBar,
    updateCurrentIndex,
    updateIdxTrail,
    updateNextColumn,
} from "./explorerSlice.js";
import { CommandLine } from "../../CommandLine/CommandLine.js";
import { QuestionModel } from "../../../models/QuestionModel.js";
import { TopicModel } from "../../../models/TopicModel.js";

const BASE_COLOR = "green";

const maxDim: Styles["Box"] = { height: "100", width: "100" };

const columnBox: Styles["Box"] = {
    ...maxDim,
    borderStyle: "round",
    borderColor: BASE_COLOR,
    flexDirection: "column",
};

export function Explorer(): React.ReactNode {
    return (
        <Box styles={maxDim} flexDirection="column">
            <TopBar />
            <Box styles={maxDim}>
                <ParentColumn />
                <CurrentColumn />
                <NextColumn />
            </Box>
            <Box height={1} width="100">
                <CommandLine />
            </Box>
        </Box>
    );
}

function ParentColumn(): React.ReactNode {
    const { parentTopic, idxTrail } = useAppSelector(selectParentColumn);

    const subTopicsLength = parentTopic?.subTopics.length ?? 0;
    const questionsLength = parentTopic?.questions.length ?? 0;
    const itemsLength = subTopicsLength + questionsLength;

    // Will always have at least one parent topic (display dummy root);
    const { listView } = useList(itemsLength ? itemsLength : 1, {
        navigation: "none",
        centerScroll: true,
    });

    useEffect(() => {
        //
    }, [parentTopic?.id]);

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
        <List listView={listView} scrollbar={{ color: BASE_COLOR }}>
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
        <Box styles={columnBox} flexShrink={1.25}>
            {content}
        </Box>
    );
}

function CurrentColumn(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { currentTopic, currentPath, parentID, idxTrail } =
        useAppSelector(selectCurrentColumn);

    const topicsCount = currentTopic.subTopics.length ?? 0;
    const questionsCount = currentTopic.questions.length ?? 0;
    const itemsCount = topicsCount + questionsCount;

    const { listView, control } = useList(itemsCount);

    const nextTopic: TopicModel | null =
        currentTopic.subTopics[control.currentIndex] ?? null;
    const nextQuestion: QuestionModel | null =
        currentTopic.questions[control.currentIndex - topicsCount] ?? null;

    useEffect(() => {
        dispatch(updateCurrentIndex(control.currentIndex));
    }, [control.currentIndex]);

    const pendingGoToIndex = useRef<number | undefined>(0);
    useEffect(() => {
        control.goToIndex(pendingGoToIndex.current ?? 0);
    }, [currentTopic.id]);

    useEffect(() => {
        dispatch(
            updateNextColumn({
                nextTopic,
                nextQuestion,
            }),
        );
    }, [control.currentIndex, currentTopic]);

    const { useEvent } = useKeymap({
        prevTopic: [{ input: "h" }, { key: "left" }, { key: "delete" }],
        nextTopic: [{ input: "l" }, { key: "right" }],
    });

    useEvent("prevTopic", () => {
        if (parentID) {
            const nextTrail = idxTrail.slice();
            pendingGoToIndex.current = nextTrail.pop();

            dispatch(
                getPrevTopicData({
                    id: parentID,
                    idxTrail: nextTrail,
                }),
            );
        }
    });

    useEvent("nextTopic", () => {
        const nextTopic = currentTopic.subTopics[control.currentIndex] ?? null;
        if (nextTopic) {
            dispatch(
                getNextTopicData({
                    id: nextTopic.id,
                    idxTrail: [...idxTrail, control.currentIndex],
                }),
            );
            pendingGoToIndex.current = 0;
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
        <Box styles={columnBox} titleTopLeft={{ title: title, color: BASE_COLOR }}>
            {!itemsCount && <Text>Add some topics/questions</Text>}
            {!!itemsCount && (
                <List listView={listView} scrollbar={{ color: BASE_COLOR }}>
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

function NextColumn(): React.ReactNode {
    const { nextTopic, nextQuestion } = useAppSelector(selectNextColumn);

    return (
        <Box styles={columnBox}>
            {nextTopic && (
                <>
                    {nextTopic.subTopics.map((topic) => {
                        return (
                            <TopicListItem
                                key={topic.id}
                                topic={topic}
                                isFocus={false}
                                dim
                            />
                        );
                    })}
                    {nextTopic.questions.map((question) => {
                        return (
                            <QuestionListItem
                                key={question.id}
                                question={question}
                                isFocus={false}
                                dim
                            />
                        );
                    })}
                </>
            )}
            {nextQuestion && (
                <>
                    <Box
                        width="100"
                        borderStyle="round"
                        borderColor="cyan"
                        titleTopLeft={{ title: "Question", color: "cyan" }}
                        flexShrink={0}
                    >
                        <Text color="cyan" dimColor>
                            {nextQuestion.question}
                        </Text>
                    </Box>
                    <HorizontalLine dimColor color="green" />
                    {!nextQuestion.A && (
                        <Box
                            width="100"
                            borderStyle="round"
                            borderColor="green"
                            titleTopLeft={{
                                title: `Answer${nextQuestion.type === "qi" ? "─[input]" : ""}`,
                                color: "green",
                            }}
                            flexShrink={0}
                        >
                            <Text color="green" dimColor>
                                {nextQuestion.answer}
                            </Text>
                        </Box>
                    )}
                    {nextQuestion.A && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "A"
                                    ? "green"
                                    : undefined
                            }
                        >{`A: ${nextQuestion.A}`}</Text>
                    )}
                    {nextQuestion.B && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "B"
                                    ? "green"
                                    : undefined
                            }
                        >{`B: ${nextQuestion.B}`}</Text>
                    )}
                    {nextQuestion.C && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "C"
                                    ? "green"
                                    : undefined
                            }
                        >{`C: ${nextQuestion.C}`}</Text>
                    )}
                    {nextQuestion.D && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "D"
                                    ? "green"
                                    : undefined
                            }
                        >{`D: ${nextQuestion.D}`}</Text>
                    )}
                </>
            )}
        </Box>
    );
}

function TopicListItem({
    topic,
    isFocus,
    dim = false,
}: {
    topic: TopicModel;
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
    question: QuestionModel;
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

function TopBar(): React.ReactNode {
    const { currentPath } = useAppSelector(selectTopBar);

    const boxStyles: Styles["Box"] = {
        height: 3,
        width: "100",
        borderStyle: "round",
        borderColor: BASE_COLOR,
        justifyContent: "center",
    };

    const textStyles: Styles["Text"] = {
        color: BASE_COLOR,
        dimColor: true,
    };

    return (
        <Box height={3} width="100" flexShrink={0}>
            <Box styles={boxStyles} justifyContent="flex-start">
                <Text styles={textStyles}>{currentPath}</Text>
            </Box>
            <Box width="25" height="100">
                <Box styles={boxStyles}>
                    <Text styles={textStyles} wrap="truncate-end">
                        {"+ Topic"}
                    </Text>
                </Box>
                <Box styles={boxStyles}>
                    <Text styles={textStyles} wrap="truncate-end">
                        {"+ Question"}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
