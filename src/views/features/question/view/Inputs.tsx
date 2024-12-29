import React, { useEffect } from "react";
import { Box, TextInput, useTextInput, useNode } from "phileas";
import { Colors } from "../../../globals.js";
import useNavigation from "./useNavigation.js";
import { QStyles } from "./style.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { selectInputAnswer, setInvalidMcAnswer } from "../questionFormSlice.js";

export function InputAnswer(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { type, A, B, C, D, invalidMcAnswer } = useAppSelector(selectInputAnswer);

    const node = useNode();
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;
    let color = node.isFocus ? Colors.Primary : Colors.Alt;
    if (invalidMcAnswer) color = Colors.Error;
    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;
    useNavigation(node);

    const { onChange, value, insert } = useTextInput();

    useEffect(() => {
        const opts = [A, B, C, D]
            .filter((opt) => opt !== undefined)
            .map((_, idx) => {
                return String.fromCharCode(65 + idx);
            });
        const isErr = !opts.find((opt) => opt === value.toUpperCase());

        dispatch(setInvalidMcAnswer((isErr || !opts.length) && type === "mc"));
    }, [type, value, insert, A, B, C, D]);

    const titleTopRight = insert
        ? "Esc to stop"
        : node.isFocus
          ? "Return/i to edit"
          : `[${nodeIndex}]`;

    return (
        <Box
            height="100"
            width="100"
            titleTopLeft={{ title: "Answer", color: color }}
            titleTopRight={{ title: titleTopRight, color: color }}
            styles={boxStyles}
            borderColor={invalidMcAnswer ? Colors.Error : undefined}
        >
            <TextInput
                onChange={onChange}
                textStyle={{ color: color }}
                inputStyle="area"
                exitKeymap={{ key: "esc" }}
            />
        </Box>
    );
}

export function InputQuestion(): React.ReactNode {
    const node = useNode();
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;
    const { onChange, insert } = useTextInput();
    const color = node.isFocus ? Colors.Primary : Colors.Alt;

    useNavigation(node);

    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;

    const titleTopRight = insert
        ? "Esc to stop"
        : node.isFocus
          ? "Return/i to edit"
          : `[${nodeIndex}]`;

    return (
        <Box
            height="100"
            width="100"
            titleTopLeft={{ title: "Question", color: color }}
            titleTopRight={{ title: titleTopRight, color: color }}
            styles={boxStyles}
        >
            <TextInput
                onChange={onChange}
                textStyle={{ color: color }}
                inputStyle="area"
                exitKeymap={{ key: "esc" }}
            />
        </Box>
    );
}
