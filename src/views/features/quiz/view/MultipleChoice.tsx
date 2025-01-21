import React, { useMemo, useRef, useState } from "react";
import * as Slice from "../quizSlice.js";
import { shuffle } from "../../decks/shuffle.js";
import {
    Box,
    Color,
    HorizontalLine,
    List,
    Text,
    useKeymap,
    useList,
    useListItem,
} from "tuir";
import { MultipleChoiceOpt } from "../../../../models/QuestionModel.js";
import { DynamicQuestionProps } from "./DynamicQuestionView.js";
import { useAppDispatch } from "../../../store/store.js";
import { Colors } from "../../../globals.js";

export function MultipleChoice({
    question: { question, multipleChoiceAnswer, a, b, c, d },
}: DynamicQuestionProps): React.ReactNode {
    const { onBlur, isFocus, itemIndex } = useListItem();
    const [flash, setFlash] = useState(false);

    const opts = useMemo(getOpts, [a, b, c, d, isFocus]);

    const { listView, control } = useList(opts.length, {
        unitSize: 3,
        windowSize: "fit",
    });

    onBlur(() => {
        control.goToIndex(0);
        clear.current();
    });

    function getOpts() {
        const arr = [a, b, c, d].filter((opt) => opt !== undefined);
        return shuffle(arr);
    }

    const { useEvent } = useKeymap({ flash: { input: "a" } });

    const clear = useRef(() => {});
    useEvent("flash", () => {
        const id = setInterval(() => {
            setFlash((flash) => !flash);
        }, 500);

        const clearInt = () => {
            clearInterval(id);
            setFlash(false);
        };

        clear.current = clearInt;
        setTimeout(clearInt, 2000);
    });

    return (
        <Box flexDirection="column">
            <Text>{question}</Text>
            <HorizontalLine dimColor />
            <List listView={listView} fitY>
                {opts.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    let overrideColor: Color | undefined;

                    if (flash && opt.id === multipleChoiceAnswer) {
                        overrideColor = Colors.Success;
                    }

                    return (
                        <MultipleChoiceOpt
                            key={opt.id}
                            letter={letter}
                            multipleChoiceAnswer={multipleChoiceAnswer!}
                            opt={opt}
                            questionIdx={itemIndex}
                            overrideColor={overrideColor}
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
    overrideColor,
}: {
    letter: string;
    opt: MultipleChoiceOpt;
    multipleChoiceAnswer: string;
    questionIdx: number;
    overrideColor?: Color;
}): React.ReactNode {
    const dispatch = useAppDispatch();
    const { isFocus, onBlur } = useListItem();
    const [chosen, setChosen] = useState(false);

    const chosenColor = opt.id === multipleChoiceAnswer ? "green" : "red";

    onBlur(() => {
        setChosen(false);
    });

    const { useEvent } = useKeymap({
        choose: { key: "return" },
    });

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

    const color = overrideColor ?? (chosen ? chosenColor : isFocus ? "blue" : undefined);
    const borderStyle = isFocus ? "bold" : "round";

    return (
        <Box
            width="100"
            height={3}
            borderStyle={borderStyle}
            borderColor={color}
            backgroundColor={overrideColor}
        >
            <Text
                color={overrideColor ? undefined : color}
            >{`${letter}: ${opt.value}`}</Text>
        </Box>
    );
}
