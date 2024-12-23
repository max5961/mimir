import React from "react";
import { Box, Pages, usePages, Viewport } from "phileas";
import { Explorer } from "./Explorer/Explorer.js";
import { CommandLine } from "./CommandLine/CommandLine.js";

export default function App(): React.ReactNode {
    const { pageView } = usePages(1);

    return (
        <Viewport flexDirection="column">
            <Box height="100" width="100">
                <Pages pageView={pageView}>
                    <Explorer />
                </Pages>
            </Box>
            <CommandLine />
        </Viewport>
    );
}
