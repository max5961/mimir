import React from "react";
import { Box, Text } from "tuir";
import { ToggleableAnswer } from "./ToggleableAnswer.js";
import { DynamicQuestionProps } from "./DynamicQuestionView.js";

export function QuestionAnswer({
    question: { question, answer },
}: DynamicQuestionProps): React.ReactNode {
    return (
        <Box
            flexShrink={0}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Text>{question}</Text>
            <ToggleableAnswer
                answer={
                    answer ??
                    "Could not find the answer. Possible incorrect question configuration"
                }
            />
        </Box>
    );
}
