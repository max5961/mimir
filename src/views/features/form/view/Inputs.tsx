import React, { useEffect } from "react";
import { Box, TextInput, useTextInput, useNode } from "phileas";
import { Colors } from "../../../globals.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { getDecorators } from "./decorators.js";
import { useNavigation } from "./useNavigation.js";
import * as Slice from "../formSlice.js";

export function AnswerInput(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { type, A, B, C, D, invalidMcAnswer } = useAppSelector(
        Slice.Selectors.AnswerInput,
    );
    const { onChange, value, insert } = useTextInput();
    const node = useNode();
    useNavigation(node);

    useEffect(() => {
        const opts = [A, B, C, D]
            .filter((opt) => opt !== undefined)
            .map((_, idx) => {
                return String.fromCharCode(65 + idx);
            });
        const isErr = !opts.find((opt) => opt === value.toUpperCase());

        dispatch(
            Slice.Actions.setInvalidMcAnswer((isErr || !opts.length) && type === "mc"),
        );
    }, [type, value, insert, A, B, C, D]);

    const { title, color, boxStyles, textStyles } = getDecorators(node, {
        hasErrors: invalidMcAnswer,
        insert,
        type: "area",
    });

    return (
        <Box
            height="100"
            width="100"
            titleTopLeft={{ title: "Answer", color }}
            titleTopRight={{ title, color }}
            styles={boxStyles}
            borderColor={invalidMcAnswer ? Colors.Error : undefined}
        >
            <TextInput
                onChange={onChange}
                textStyle={textStyles}
                inputStyle="area"
                exitKeymap={{ key: "esc" }}
            />
        </Box>
    );
}

export function QuestionInput(): React.ReactNode {
    const node = useNode();
    const { onChange, insert } = useTextInput();
    useNavigation(node);

    const { color, title, boxStyles, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert,
        type: "area",
    });

    return (
        <Box
            height="100"
            width="100"
            titleTopLeft={{ title: "Question", color }}
            titleTopRight={{ title, color }}
            styles={boxStyles}
        >
            <TextInput
                onChange={onChange}
                textStyle={textStyles}
                inputStyle="area"
                exitKeymap={{ key: "esc" }}
            />
        </Box>
    );
}
