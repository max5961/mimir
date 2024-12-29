import React from "react";
import { Box, Text } from "phileas";
import { TopicModel } from "../../../../models/TopicModel.js";
import { Colors } from "../../../globals.js";

export default function TopicListItem({
    topic,
    isFocus,
    dim = false,
}: {
    topic: TopicModel;
    isFocus: boolean;
    dim?: boolean;
}): React.ReactNode {
    let bgColor = isFocus ? Colors.Secondary : undefined;
    if (dim) {
        bgColor = isFocus ? Colors.ShallowFocus : undefined;
    }

    const iconColor = isFocus ? undefined : Colors.Alt;
    const textColor = isFocus ? undefined : Colors.Primary;

    return (
        <Box width="100" backgroundColor={bgColor} flexShrink={0}>
            <Box height={1} width={2} backgroundColor="inherit" flexShrink={0}>
                <Text color={iconColor} wrap="truncate-end">
                    {"☰ "}
                </Text>
            </Box>
            <Box height={1} backgroundColor="inherit">
                <Text bold color={textColor} wrap="truncate-end">
                    {topic.name}
                </Text>
            </Box>
        </Box>
    );
}
