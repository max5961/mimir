import React, { useState } from "react";
import * as Slice from "../quizSlice.js";
import { useAppDispatch } from "../../../store/store.js";
import {
    useListItem,
    useTextInput,
    Color,
    Box,
    Text,
    TextInput,
    Styles,
    useKeymap,
} from "tuir";
import { Colors, Icons } from "../../../globals.js";
import { ToggleableAnswer } from "./ToggleableAnswer.js";
import { DynamicQuestionProps } from "./DynamicQuestionView.js";

export function QuestionInput({ question }: DynamicQuestionProps): React.ReactNode {
    const dispatch = useAppDispatch();

    const [state, setState] = useState<{ ignoreCase: boolean; multiline: boolean }>({
        multiline: false,
        ignoreCase: false,
    });

    const { onBlur, itemIndex } = useListItem();
    const { onChange, setValue, insert } = useTextInput();

    onBlur(() => {
        setValue("");
    });

    const onExit = (value: string) => {
        let userInput = value.trimStart().trimEnd();
        let answer = question?.answer?.trimStart().trimEnd();

        if (state.ignoreCase) {
            userInput = userInput.toUpperCase();
            answer = answer?.toUpperCase();
        }

        if (userInput === answer) {
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

    const { useEvent } = useKeymap({
        toggleMultiline: { input: "t" },
        toggleIgnoreCase: { input: "c" },
    });
    useEvent("toggleMultiline", toggleMultiline);
    useEvent("toggleIgnoreCase", toggleIgnoreCase);

    function toggleMultiline() {
        setState((prev) => {
            return {
                ...prev,
                multiline: !prev.multiline,
            };
        });
    }

    function toggleIgnoreCase() {
        setState((prev) => {
            return {
                ...prev,
                ignoreCase: !prev.ignoreCase,
            };
        });
    }

    const borderStyle: Styles["Box"]["borderStyle"] = insert ? "double" : "round";
    let color: Color = Colors.Alt;
    let icon = "";
    let textInsertMode = `${Icons.Bullet} Text Insert Mode: `;
    let ignoreCaseMode = `${Icons.Bullet} Ignore Case: `;

    if (state.multiline) textInsertMode += `[${Icons.MultiLine}]`;
    if (!state.multiline) textInsertMode += `[${Icons.SingleLine}]`;
    textInsertMode += " click or 't' to toggle";

    if (state.ignoreCase) ignoreCaseMode += `[${Icons.Check}]`;
    if (!state.ignoreCase) ignoreCaseMode += `[${Icons.X}]`;
    ignoreCaseMode += " click or 'c' to toggle";

    if (!insert) {
        // set color
        if (question.status === "incorrect") color = Colors.Error;
        if (question.status === "correct") color = Colors.Success;

        // set icon
        if (question.status === "correct") icon = ` ${Icons.Check} `;
        if (question.status === "incorrect") icon = ` ${Icons.X} `;
    }

    return (
        <Box flexDirection="column">
            <Box>
                <Text>{question.question}</Text>
            </Box>
            <Box
                width="100"
                borderStyle={borderStyle}
                borderColor={color}
                borderDimColor={insert}
                paddingX={1}
                titleTopRight={{ title: icon, color }}
            >
                <TextInput
                    onChange={onChange}
                    onExit={onExit}
                    inputStyle={state.multiline ? "area" : "line"}
                    exitKeymap={
                        state.multiline
                            ? { key: "esc" }
                            : [{ key: "esc" }, { key: "return" }]
                    }
                    autoEnter
                />
            </Box>
            <ToggleableAnswer answer={question.answer ?? "Could not find answer"} />
            <Box onClick={toggleMultiline}>
                <Text color={Colors.Secondary} dimColor>
                    {textInsertMode}
                </Text>
            </Box>
            <Box onClick={toggleIgnoreCase}>
                <Text color={Colors.Secondary} dimColor>
                    {ignoreCaseMode}
                </Text>
            </Box>
        </Box>
    );
}
