import React, { useEffect } from "react";
import { Box, Pages, usePages, Viewport, StdinState } from "phileas";
import { useAppDispatch } from "./store/store.js";
import { RootTopic } from "../root.js";
import { getTopicData } from "./features/explorer/explorerSlice.js";
import Explorer from "./features/explorer/view/Explorer.js";
import QuestionView from "./features/question/view/QuestionView.js";

const fullscreen = true;

export default function App(): React.ReactNode {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getTopicData({ id: RootTopic.id }));
    }, []);

    const { pageView } = usePages(1);

    const content = (
        <Box height="100" width="100">
            <Pages pageView={pageView}>
                <Explorer />
            </Pages>
            <QuestionView />
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
