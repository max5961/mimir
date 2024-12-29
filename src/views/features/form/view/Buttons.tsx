import React from "react";
import { Box, Text, useNode } from "phileas";
import { getDecorators } from "./decorators.js";
import { useNavigation } from "./useNavigation.js";

export function CancelButton(): React.ReactNode {
    const node = useNode();
    useNavigation(node);

    const { title, boxStyles, color, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    return (
        <Box height={3} styles={boxStyles} paddingX={10} titleTopRight={{ title, color }}>
            <Text styles={textStyles}>Cancel</Text>
        </Box>
    );
}

export function SubmitButton(): React.ReactNode {
    const node = useNode();
    useNavigation(node);

    const { title, boxStyles, color, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    return (
        <Box
            height={3}
            styles={boxStyles}
            paddingX={10}
            titleTopRight={{ title: title, color: color }}
        >
            <Text styles={textStyles}>Submit</Text>
        </Box>
    );
}
