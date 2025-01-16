import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Color,
    HorizontalLine,
    List,
    Styles,
    Text,
    TextInput,
    useKeymap,
    useList,
    useListItem,
    usePage,
    useTextInput,
    useViewportDimensions,
} from "tuir";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { Colors } from "../../../globals.js";
import { shuffle } from "../../decks/shuffle.js";
import { MultipleChoiceOpt } from "../../../../models/QuestionModel.js";
import * as Slice from "../quizSlice.js";
import * as DeckSlice from "../../decks/decksSlice.js";

export default function Quiz(): React.ReactNode {
    const dispatch = useAppDispatch();
    const deck = useAppSelector(DeckSlice.Selectors.activeDeck);
    const questions = useAppSelector(Slice.Selectors.questions);
    const stats = useAppSelector(Slice.Selectors.stats);

    const { onPageFocus, onPageBlur } = usePage();

    const { listView, control } = useList(questions.length, {
        navigation: "none",
        windowSize: 1,
        unitSize: "fit-unit",
    });

    const { useEvent } = useKeymap({
        next: [{ input: "l" }, { key: "right" }],
        prev: [{ input: "h" }, { key: "left" }],
    });

    useEvent("next", control.nextItem);
    useEvent("prev", control.prevItem);

    onPageFocus(() => {
        dispatch(
            Slice.Actions.setQuestionsArray(
                deck.map((question) => {
                    return { ...question, status: "unanswered" };
                }),
            ),
        );
    });

    onPageBlur(() => {
        dispatch(Slice.Actions.reset());
    });

    const { width } = useViewportDimensions();
    const cardWidth = Math.min(width, 75);
    const progressText = ` Question: ${control.currentIndex + 1}/${questions.length} `;
    const curr = questions[control.currentIndex];

    const btnStyle: Styles["Box"] = {
        height: 3,
        paddingX: 1,
        borderStyle: "round",
        leftActive: { borderColor: Colors.Alt },
    };

    return (
        <Box
            height="100"
            width="100"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <Box height="100" width="100" position="absolute" alignItems="flex-start">
                <Box width="100" flexDirection="column">
                    <Box width="100" justifyContent="flex-end" gap={1}>
                        <Box styles={btnStyle}>
                            <Text>Caps</Text>
                        </Box>
                        <Box styles={btnStyle}>
                            <Text>Placeholder</Text>
                        </Box>
                        <Box styles={btnStyle}>
                            <Text>Placeholder</Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                width={cardWidth}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                borderStyle="round"
                borderColor={Colors.Primary}
            >
                <Box width="100" flexDirection="column" gap={3} paddingY={1} paddingX={2}>
                    <Box flexDirection="column">
                        <Box
                            height={1}
                            width="100"
                            flexShrink={0}
                            justifyContent="space-between"
                        >
                            <Text>{progressText}</Text>
                            <Status status={curr?.status} />
                        </Box>
                        <HorizontalLine dimColor />
                    </Box>
                    <Box minHeight={11} width="100">
                        <List
                            listView={listView}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            scrollbar={{ hide: true }}
                            fitY
                        >
                            {questions.map((question, idx) => {
                                return (
                                    <QuestionView
                                        key={`${question.id}`}
                                        question={question}
                                    ></QuestionView>
                                );
                            })}
                        </List>
                    </Box>
                    <Box flexDirection="column">
                        <HorizontalLine dimColor />
                        <Box
                            width="100"
                            height={1}
                            flexShrink={0}
                            justifyContent="space-between"
                        >
                            <Text color={Colors.Alt} dimColor>
                                {`Correct: ${stats.correct}`}
                            </Text>
                            <Text color={Colors.Alt} dimColor>
                                {`Incorrrect: ${stats.incorrect}`}
                            </Text>
                            <Text color={Colors.Alt} dimColor>
                                {`Unanswered: ${stats.unanswered}`}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Status({ status }: { status?: Slice.Question["status"] }): React.ReactNode {
    let color: Color | undefined;
    if (status === "correct") color = "green";
    if (status === "incorrect") color = "red";

    let icon = " ";
    if (status === "correct") icon = "✓";
    if (status === "incorrect") icon = "✕";

    return <Text color={color}>{`[ ${icon} ]`}</Text>;
}

type Props = {
    question: Slice.Question;
};

function QuestionView({ question }: Props): React.ReactNode {
    if (question.type === "mc") {
        return <MultipleChoice question={question} />;
    }

    if (question.type === "qa") {
        return <QuestionAnswer question={question} />;
    }

    if (question.type === "qi") {
        return <QuestionInput question={question} />;
        // return <QuestionAnswer question={question} />;
    }

    return null;
}

function QuestionAnswer({
    question: { question, answer, status },
}: Props): React.ReactNode {
    const dispatch = useAppDispatch();

    const [show, setShow] = useState(false);
    const { onBlur, itemIndex } = useListItem();

    onBlur(() => setShow(false));

    const { useEvent } = useKeymap({
        toggleAnswer: { input: "a" },
        markCorrect: { input: " " },
        markIncorrect: { input: "x" },
    });

    useEvent("toggleAnswer", () => {
        setShow(!show);
    });

    useEvent("markCorrect", () => {
        dispatch(Slice.Actions.setQuestion({ idx: itemIndex, status: "correct" }));
    });

    useEvent("markIncorrect", () => {
        dispatch(Slice.Actions.setQuestion({ idx: itemIndex, status: "incorrect" }));
    });

    const answerView = (show: boolean) => (
        <Box
            borderStyle={show ? "round" : undefined}
            borderColor="magenta"
            titleTopCenter={{ title: show ? "Answer" : "", color: "magenta" }}
            width="100"
            padding={1}
            marginY={show ? 1 : 2}
            justifyContent="center"
            alignItems="center"
        >
            <Text>{show ? answer : ""}</Text>
        </Box>
    );

    return (
        <Box
            flexShrink={0}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Text>{question}</Text>
            {answerView(show)}
        </Box>
    );
}

function QuestionInput({ question }: Props): React.ReactNode {
    const dispatch = useAppDispatch();

    const { onBlur, itemIndex } = useListItem();
    const { onChange, value, setValue, insert } = useTextInput();
    const [show, setShow] = useState(false);

    onBlur(() => {
        setShow(false);
        setValue("");
    });

    const { useEvent } = useKeymap({ toggleShow: { input: "s" } });
    useEvent("toggleShow", () => setShow(!show));

    const onExit = (value: string) => {
        if (value.trimStart().trimEnd() === question?.answer?.trimStart().trimEnd()) {
            dispatch(
                Slice.Actions.setQuestion({
                    idx: itemIndex,
                    status: "correct",
                }),
            );
        } else {
            dispatch(
                Slice.Actions.setQuestion({
                    idx: itemIndex,
                    status: "incorrect",
                }),
            );
        }
    };

    const borderStyle = insert ? "bold" : "round";
    let borderColor: Color = Colors.Alt;
    if (!insert) {
        if (question.status === "incorrect") borderColor = "red";
        if (question.status === "correct") borderColor = "green";
    }

    return (
        <Box flexDirection="column">
            <Text>{question.question}</Text>
            <Box width="100" borderStyle={borderStyle} borderColor={borderColor}>
                <TextInput
                    onChange={onChange}
                    autoEnter
                    inputStyle="area"
                    onExit={onExit}
                />
            </Box>
            {show && (
                <Box>
                    <Text>{question.answer}</Text>
                </Box>
            )}
        </Box>
    );
}

function MultipleChoice({
    question: { question, multipleChoiceAnswer, a, b, c, d },
}: Props): React.ReactNode {
    const { onBlur, isFocus, itemIndex } = useListItem();

    const opts = useMemo(getOpts, [a, b, c, d, isFocus]);

    const { listView, control } = useList(opts.length, {
        unitSize: 3,
        windowSize: "fit",
    });

    onBlur(() => {
        control.goToIndex(0);
    });

    function getOpts() {
        const arr = [a, b, c, d].filter((opt) => opt !== undefined);
        return shuffle(arr);
    }

    return (
        <Box flexDirection="column">
            <Text>{question}</Text>
            <HorizontalLine dimColor />
            <List listView={listView} fitY>
                {opts.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    return (
                        <MultipleChoiceOpt
                            key={opt.id}
                            letter={letter}
                            multipleChoiceAnswer={multipleChoiceAnswer!}
                            opt={opt}
                            questionIdx={itemIndex}
                        />
                    );
                })}
            </List>
        </Box>
    );
}

function MultipleChoiceOpt({
    letter,
    opt,
    multipleChoiceAnswer,
    questionIdx,
}: {
    letter: string;
    opt: MultipleChoiceOpt;
    multipleChoiceAnswer: string;
    questionIdx: number;
}): React.ReactNode {
    const dispatch = useAppDispatch();
    const { isFocus, onBlur } = useListItem();
    const [chosen, setChosen] = useState(false);
    const chosenColor = opt.id === multipleChoiceAnswer ? "green" : "red";

    onBlur(() => {
        setChosen(false);
    });

    const { useEvent } = useKeymap({ choose: { key: "return" } });
    useEvent("choose", () => {
        dispatch(
            Slice.Actions.setQuestion({
                idx: questionIdx,
                status: opt.id === multipleChoiceAnswer ? "correct" : "incorrect",
            }),
        );
        setImmediate(() => {
            setChosen(true);
        });
    });

    const color = chosen ? chosenColor : isFocus ? "blue" : undefined;
    const borderStyle = isFocus ? "bold" : "round";

    return (
        <Box width="100" height={3} borderStyle={borderStyle} borderColor={color}>
            <Text color={color}>{`${letter}: ${opt.value}`}</Text>
        </Box>
    );
}
