import React, { useEffect } from "react";
import { Box, Pages, useApp, useKeymap, usePages, Viewport } from "tuir";
import { useAppDispatch } from "./store/store.js";
import { RootTopic } from "../root.js";
import Explorer from "./features/explorer/view/Explorer.js";
import * as ExpSlice from "./features/explorer/explorerSlice.js";
import * as DecksSlice from "./features/decks/decksSlice.js";
import DecksView from "./features/decks/view/DecksView.js";
import Quiz from "./features/quiz/view/Quiz.js";

export default function App(): React.ReactNode {
    const { exit } = useApp();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(ExpSlice.Actions.getTopicData({ topicID: RootTopic.id }));
        dispatch(DecksSlice.Actions.getSavedDecks());
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
        quit: { input: "q" },
    });

    useEvent("goToPage", (char: string) => {
        const num = Number(char);
        if (Number.isNaN(num)) return;
        control.goToPage(num - 1);
    });

    useEvent("quit", () => {
        exit();
    });

    return (
        <Viewport flexDirection="column">
            <Box height="100" width="100">
                <Pages pageView={pageView}>
                    <DecksView />
                    <Explorer />
                    <Quiz />
                </Pages>
            </Box>
        </Viewport>
    );
}
