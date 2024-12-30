import React from "react";
import { Box, TextInput, useTextInput, useNode } from "phileas";
import { getDecorators } from "./decorators.js";
import { useNavigation } from "./useNavigation.js";

export function AnswerInput(): React.ReactNode {
    const { onChange, insert } = useTextInput();
    const node = useNode();
    useNavigation(node);

    const { title, color, boxStyles, textStyles } = getDecorators(node, {
        hasErrors: false,
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
