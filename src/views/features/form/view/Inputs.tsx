import React from "react";
import { Box, TextInput, useTextInput, useNode, KeyInput, useKeymap } from "phileas";
import { getDecorators } from "./decorators.js";
import { goToClickedNode, useNavigation } from "./useNavigation.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../formSlice.js";

export function QuestionInput(): React.ReactNode {
    const dispatch = useAppDispatch();
    const returnAction = useAppSelector(Slice.Selectors.questionInputReturnAction);
    const node = useNode();
    const { onChange, insert } = useTextInput();
    useNavigation(node);

    const { useEvent } = useKeymap({ toggle: { key: "ctrl", input: "t" } });
    useEvent("toggle", () => {
        const value: typeof returnAction = returnAction === "exit" ? "new-line" : "exit";
        dispatch(Slice.Actions.setQuestionInputReturnAction(value));
    });

    const { titleBottomRight, exitKeymap } = getReturnActionDecorators(
        returnAction,
        insert,
        node.isFocus,
    );

    const { color, title, boxStyles, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert,
        type: "area",
        returnAction,
    });

    return (
        <Box
            height="100"
            width="100"
            titleTopLeft={{ title: "Question", color }}
            titleTopRight={{ title: title, color }}
            titleBottomRight={{ title: titleBottomRight, color }}
            onClick={goToClickedNode(node)}
            styles={boxStyles}
        >
            <TextInput
                onChange={onChange}
                textStyle={textStyles}
                inputStyle="area"
                exitKeymap={exitKeymap}
            />
        </Box>
    );
}

export function AnswerInput(): React.ReactNode {
    const dispatch = useAppDispatch();
    const returnAction = useAppSelector(Slice.Selectors.answerInputReturnAction);
    const { onChange, insert } = useTextInput();
    const node = useNode();
    useNavigation(node);

    const { useEvent } = useKeymap({ toggle: { key: "ctrl", input: "t" } });
    useEvent("toggle", () => {
        const value: typeof returnAction = returnAction === "exit" ? "new-line" : "exit";
        dispatch(Slice.Actions.setAnswerInputReturnAction(value));
    });

    const { exitKeymap, titleBottomRight } = getReturnActionDecorators(
        returnAction,
        insert,
        node.isFocus,
    );

    const { title, color, boxStyles, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert,
        type: "area",
        returnAction,
    });

    return (
        <Box
            height="100"
            width="100"
            titleTopLeft={{ title: "Answer", color }}
            titleTopRight={{ title, color }}
            titleBottomRight={{ title: titleBottomRight, color }}
            onClick={goToClickedNode(node)}
            styles={boxStyles}
        >
            <TextInput
                onChange={onChange}
                textStyle={textStyles}
                inputStyle="area"
                exitKeymap={exitKeymap}
            />
        </Box>
    );
}

function getReturnActionDecorators(
    returnAction: Slice.InputReturnAction,
    insert: boolean,
    focus: boolean,
) {
    let titleBottomRight = "";
    if (focus && !insert) {
        titleBottomRight =
            returnAction === "exit" && !insert
                ? "[Return action: stop] (toggle ctrl+t)"
                : "[Return action: \\n] (toggle ctrl+t)";
    }

    const exitKeymap: KeyInput = [{ key: "esc" }];
    returnAction === "exit" && exitKeymap.push({ key: "return" });

    return { titleBottomRight, exitKeymap };
}
