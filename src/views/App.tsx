import React, { useEffect } from "react";
import { Box, Pages, usePages, Viewport, StdinState } from "phileas";
import { useAppDispatch } from "./store/store.js";
import { loadTopic } from "./features/explorer/explorerSlice.js";
import { RootTopic } from "../root.js";
import { Explorer } from "./features/explorer/Explorer.js";

export default function App(): React.ReactNode {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadTopic(RootTopic.id));
    }, []);

    const { pageView } = usePages(1);

    // return (
    //     <Box flexDirection="column" height={15} width="100">
    //         <Box height="100" width="100">
    //             <Pages pageView={pageView}>
    //                 <Explorer />
    //             </Pages>
    //         </Box>
    //         <Box height={1} width="100">
    //             <StdinState showEvents showRegister width={50} />
    //         </Box>
    //     </Box>
    // );

    return (
        <Viewport flexDirection="column">
            <Box height="100" width="100">
                <Pages pageView={pageView}>
                    <Explorer />
                </Pages>
            </Box>
            <Box height={1} width="100">
                <StdinState showEvents showRegister width={50} />
            </Box>
        </Viewport>
    );
}
