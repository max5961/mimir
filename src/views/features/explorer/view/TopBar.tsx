import React from "react";
import { Styles, Box, Text } from "tuir";
import { Colors } from "../../../globals.js";
import { useAppSelector } from "../../../store/store.js";
import * as Slice from "../explorerSlice.js";

export default function TopBar(): React.ReactNode {
    const { currentPath } = useAppSelector(Slice.Selectors.TopBar);

    const boxStyles: Styles["Box"] = {
        height: 3,
        width: "100",
        borderStyle: "round",
        borderColor: Colors.Primary,
        justifyContent: "center",
    };

    const textStyles: Styles["Text"] = {
        color: Colors.Primary,
        dimColor: true,
    };

    return (
        <Box height={3} width="100" flexShrink={0}>
            <Box styles={boxStyles} justifyContent="flex-start">
                <Text styles={textStyles}>{currentPath}</Text>
            </Box>
            <Box width="25" height="100">
                <Box styles={boxStyles}>
                    <Text styles={textStyles} wrap="truncate-end">
                        {"+ Topic"}
                    </Text>
                </Box>
                <Box styles={boxStyles}>
                    <Text styles={textStyles} wrap="truncate-end">
                        {"+ Question"}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
