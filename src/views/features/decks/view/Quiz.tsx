import React, { useMemo, useState } from "react";
import {
    Box,
    HorizontalLine,
    List,
    Text,
    TextInput,
    useKeymap,
    useList,
    useListItem,
    useTextInput,
    useViewportDimensions,
} from "tuir";
import { useAppSelector } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { QuizQuestion } from "../../../../models/DeckModel.js";
import { Colors } from "../../../globals.js";
import { shuffle } from "../shuffle.js";
import { MultipleChoiceOpt } from "../../../../models/QuestionModel.js";

export default function Quiz(): React.ReactNode {
    const deck = useAppSelector(Slice.Selectors.activeDeck);

    const { listView, control } = useList(deck.length, {
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

    const progressText = ` Question: ${control.currentIndex + 1}/${deck.length} `;

    const { width } = useViewportDimensions();

    const cardWidth = Math.min(width, 75);

    return (
        <Box
            height="100"
            width="100"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <Box height="100" width="100" position="absolute" alignItems="flex-start">
                <Box
                    height={3}
                    width="100"
                    borderStyle="round"
                    justifyContent="space-between"
                >
                    <Text>Correct</Text>
                    <Text>Incorrect</Text>
                    <Text>Unanswered/Skipped</Text>
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
                <Box width="100" flexDirection="column" paddingY={1} paddingX={2}>
                    <Box
                        height={1}
                        width="100"
                        flexShrink={0}
                        justifyContent="space-between"
                    >
                        <Text>{progressText}</Text>
                        <Text>{`[   ]`}</Text>
                    </Box>
                    <HorizontalLine />
                    <Box minHeight={11} width="100">
                        <List
                            listView={listView}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            scrollbar={{ hide: true }}
                            fitY
                        >
                            {deck.map((question, idx) => {
                                return (
                                    <QuestionView
                                        key={`${question.id}`}
                                        question={question}
                                    ></QuestionView>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

type Props = {
    question: QuizQuestion;
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

function QuestionAnswer({ question: { question, answer } }: Props): React.ReactNode {
    const { onBlur } = useListItem();
    const [show, setShow] = useState(false);
    onBlur(() => setShow(false));

    const { useEvent } = useKeymap({ toggleAnswer: { input: "s" } });
    useEvent("toggleAnswer", () => {
        setShow(!show);
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
    const { onBlur } = useListItem();
    const { onChange, value, setValue } = useTextInput();
    const [show, setShow] = useState(false);

    onBlur(() => {
        setShow(false);
        setValue("");
    });

    const { useEvent } = useKeymap({ toggleShow: { input: "s" } });
    useEvent("toggleShow", () => setShow(!show));

    return (
        <Box flexDirection="column">
            <Text>{question.question}</Text>
            <Box width="100" borderStyle="round">
                <TextInput onChange={onChange} autoEnter inputStyle="area" />
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
    const { onBlur, isFocus } = useListItem();

    const opts = useMemo(getOpts, [a, b, c, d, isFocus]);

    const { listView } = useList(opts.length, { unitSize: 3, windowSize: "fit" });

    function getOpts() {
        const arr = [a, b, c, d].filter((opt) => opt !== undefined);
        return shuffle(arr);
    }

    return (
        <Box flexDirection="column">
            <Text>{question}</Text>
            <HorizontalLine />
            <List listView={listView} fitY>
                {opts.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    return (
                        <MultipleChoiceOpt
                            key={opt.id}
                            letter={letter}
                            multipleChoiceAnswer={multipleChoiceAnswer!}
                            opt={opt}
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
}: {
    letter: string;
    opt: MultipleChoiceOpt;
    multipleChoiceAnswer: string;
}): React.ReactNode {
    const { isFocus } = useListItem();
    const color = isFocus ? "blue" : undefined;
    const borderStyle = isFocus ? "bold" : "round";

    return (
        <Box width="100" height={3} borderStyle={borderStyle} borderColor={color}>
            <Text color={color}>{`${letter}: ${opt.value}`}</Text>
        </Box>
    );
}
