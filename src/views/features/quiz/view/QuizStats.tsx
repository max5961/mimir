import React from "react";
import { useAppSelector } from "../../../store/store.js";
import * as Slice from "../quizSlice.js";
import { Box, HorizontalLine, Text } from "tuir";
import { Colors } from "../../../globals.js";

export function QuizStats(): React.ReactNode {
    const stats = useAppSelector(Slice.Selectors.stats);

    return (
        <Box flexDirection="column">
            <HorizontalLine dimColor />
            <Box width="100" height={1} flexShrink={0} justifyContent="space-between">
                <Text color={Colors.Alt} dimColor>
                    {`Correct: ${stats.correct}`}
                </Text>
                <Text color={Colors.Alt} dimColor>
                    {`Incorrrect: ${stats.incorrect}`}
                </Text>
                <Text color={Colors.Alt} dimColor>
                    {`Unanswered: ${stats.unanswered}`}
                </Text>
            </Box>
        </Box>
    );
}
