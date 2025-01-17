import React from "react";
import { Color, Text } from "tuir";
import * as Slice from "../quizSlice.js";

export function QuestionStatus({
    status,
}: {
    status?: Slice.Question["status"];
}): React.ReactNode {
    let color: Color | undefined;
    if (status === "correct") color = "green";
    if (status === "incorrect") color = "red";

    let icon = " ";
    if (status === "correct") icon = "✓";
    if (status === "incorrect") icon = "✕";

    return <Text color={color}>{`[ ${icon} ]`}</Text>;
}
