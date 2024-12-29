import React from "react";
import { Box, Text, useNode } from "phileas";
import useNavigation from "./useNavigation.js";
import { QStyles } from "./style.js";

export function CancelButton(): React.ReactNode {
    const node = useNode();
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;
    useNavigation(node);

    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;
    const color = boxStyles.borderColor;

    const title = !node.isFocus ? `[${nodeIndex}]` : "Return to cancel";

    return (
        <Box
            height={3}
            styles={boxStyles}
            paddingX={10}
            titleTopRight={{ title: title, color: color }}
        >
            <Text color={boxStyles.borderColor}>Cancel</Text>
        </Box>
    );
}

export function SubmitButton(): React.ReactNode {
    const node = useNode();
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;
    useNavigation(node);

    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;
    const color = boxStyles.borderColor;

    const title = `[${nodeIndex}]`;

    return (
        <Box
            height={3}
            styles={boxStyles}
            paddingX={10}
            titleTopRight={{ title: title, color: color }}
        >
            <Text color={color}>Submit</Text>
        </Box>
    );
}
