import React, { useState } from "react";
import { Box, Text, useKeymap, useListItem } from "tuir";
import { Colors } from "../../../globals.js";

type Props = {
    answer: string;
};

export function ToggleableAnswer({ answer }: Props): React.ReactNode {
    const { onBlur } = useListItem();
    const [show, setShow] = useState(false);

    onBlur(() => setShow(false));

    const { useEvent } = useKeymap({ toggleShow: { input: "a" } });

    useEvent("toggleShow", () => {
        setShow(!show);
    });

    const color = Colors.Secondary;

    return (
        <Box
            borderStyle={show ? "round" : undefined}
            borderColor={color}
            titleTopCenter={{ title: show ? "Answer" : "", color: color }}
            width="100"
            padding={1}
            marginY={show ? 1 : 2}
            justifyContent="center"
            alignItems="center"
        >
            <Text color={color}>{show ? answer : ""}</Text>
        </Box>
    );
}
