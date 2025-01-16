import React from "react";
import { Box } from "tuir";
import { EStyles } from "./style.js";
import CommandLine from "../../../CommandLine/CommandLine.js";
import ParentColumn from "./ParentColumn.js";
import CurrentColumn from "./CurrentColumn.js";
import NextColumn from "./NextColumn.js";
import TopBar from "./TopBar.js";
import Form from "../../form/view/Form.js";

export default function Explorer(): React.ReactNode {
    return (
        <Box styles={EStyles.MaxDim} flexDirection="column">
            <TopBar />
            <Box styles={EStyles.MaxDim}>
                <ParentColumn />
                <CurrentColumn />
                <NextColumn />
            </Box>
            <Box height={1} width="100">
                <CommandLine />
            </Box>
            <Form />
        </Box>
    );
}
