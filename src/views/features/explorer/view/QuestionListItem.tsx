import React from "react";
import { Box, Text } from "tuir";
import { QuestionModel } from "../../../../models/QuestionModel.js";
import { Colors } from "../../../globals.js";

export default function QuestionListItem({
    question,
    isFocus,
    dim = false,
}: {
    question: QuestionModel;
    isFocus: boolean;
    dim?: boolean;
}): React.ReactNode {
    let bgColor = isFocus ? Colors.Secondary : undefined;
    if (dim) {
        bgColor = isFocus ? "gray" : undefined;
    }

    const iconColor = isFocus ? undefined : Colors.Alt;
    const textColor = isFocus ? undefined : Colors.Primary;

    const textContent = question.question.replace(/\n/g, "");

    return (
        <Box width="100" backgroundColor={bgColor}>
            <Box height={1} width={2} backgroundColor="inherit" flexShrink={0}>
                <Text color={iconColor} wrap="overflow">
                    {"∘ "}
                </Text>
            </Box>
            <Box width="100" height={1} backgroundColor="inherit">
                <Text italic dimColor={!isFocus} color={textColor} wrap="truncate-end">
                    {textContent}
                </Text>
            </Box>
        </Box>
    );
}
