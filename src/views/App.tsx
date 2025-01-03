import React, { useEffect } from "react";
import { Box, Pages, usePages, Viewport } from "tuir";
import { useAppDispatch } from "./store/store.js";
import { RootTopic } from "../root.js";
import Explorer from "./features/explorer/view/Explorer.js";
import Form from "./features/form/view/Form.js";
import * as ExpSlice from "./features/explorer/explorerSlice.js";

const fullscreen = true;

export default function App(): React.ReactNode {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(ExpSlice.Actions.getTopicData({ topicID: RootTopic.id }));
    }, []);

    const { pageView } = usePages(1);

    const content = (
        <Box height="100" width="100">
            <Pages pageView={pageView}>
                <Explorer />
            </Pages>
            <Form />
        </Box>
    );

    return fullscreen ? (
        <Viewport flexDirection="column">{content}</Viewport>
    ) : (
        <Box height={20} width="100">
            {content}
        </Box>
    );
}
