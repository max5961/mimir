import React, { useEffect } from "react";
import { Box, Pages, useKeymap, usePages, Viewport } from "tuir";
import { useAppDispatch } from "./store/store.js";
import { RootTopic } from "../root.js";
import Explorer from "./features/explorer/view/Explorer.js";
import Form from "./features/form/view/Form.js";
import * as ExpSlice from "./features/explorer/explorerSlice.js";
import ActiveDeck from "./features/decks/view/ActiveDeck.js";
import Quiz from "./features/decks/view/Quiz.js";

export default function App(): React.ReactNode {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(ExpSlice.Actions.getTopicData({ topicID: RootTopic.id }));
    }, []);

    const { pageView, control } = usePages(3);

    const { useEvent } = useKeymap({
        goToPage: [
            { input: "1" },
            { input: "2" },
            { input: "3" },
            { input: "4" },
            { input: "5" },
            { input: "6" },
            { input: "7" },
            { input: "8" },
            { input: "9" },
        ],
    });

    useEvent("goToPage", (char: string) => {
        const num = Number(char);
        if (Number.isNaN(num)) return;
        control.goToPage(num - 1);
    });

    return (
        <Viewport flexDirection="column">
            <Box height="100" width="100">
                <Pages pageView={pageView}>
                    <Explorer />
                    <ActiveDeck />
                    <Quiz />
                </Pages>
                <Form />
            </Box>
        </Viewport>
    );
}
