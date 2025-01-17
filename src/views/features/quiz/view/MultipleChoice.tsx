import React, { useMemo, useState } from "react";
import * as Slice from "../quizSlice.js";
import { shuffle } from "../../decks/shuffle.js";
import { Box, HorizontalLine, List, Text, useKeymap, useList, useListItem } from "tuir";
import { MultipleChoiceOpt } from "../../../../models/QuestionModel.js";
import { DynamicQuestionProps } from "./DynamicQuestionView.js";
import { useAppDispatch } from "../../../store/store.js";

export function MultipleChoice({
    question: { question, multipleChoiceAnswer, a, b, c, d },
}: DynamicQuestionProps): React.ReactNode {
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
