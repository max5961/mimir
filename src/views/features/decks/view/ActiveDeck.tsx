import React, { useEffect } from "react";
import {
    Box,
    Color,
    HorizontalLine,
    List,
    Styles,
    Text,
    useKeymap,
    useList,
    useListItem,
} from "tuir";
import { Colors } from "../../../globals.js";
import SavedPlaylists from "./SavedDecks.js";
import DecksCommandLine from "./DecksCommandLine.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { QuizQuestion } from "../../../../models/DeckModel.js";
import { PreviewColumn } from "../../explorer/view/NextColumn.js";

const boxStyles: Styles["Box"] = {
    height: "100",
    width: "100",
    borderColor: Colors.Primary,
    borderStyle: "round",
};

export default function ActiveDeck(): React.ReactNode {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(Slice.Actions.getActiveDeck());
    }, []);

    return (
        <Box height="100" width="100" flexDirection="column">
            <Box
                height={3}
                width="100"
                flexShrink={0}
                styles={boxStyles}
                justifyContent="center"
            >
                <Text color={Colors.Primary} bold>
                    Deck
                </Text>
            </Box>
            <Box height="100" width="100">
                <Box styles={boxStyles}>
                    <ActiveList />
                </Box>
                <Box height="100" width="100" flexShrink={1.6}>
                    <Preview />
                </Box>
                <SavedPlaylists />
            </Box>
            <DecksCommandLine />
        </Box>
    );
}

const FlexShrinkColumns = {
    Path: 3,
};

function ActiveList(): React.ReactNode {
    const dispatch = useAppDispatch();
    const deck = useAppSelector(Slice.Selectors.activeDeck);

    const { listView, control } = useList(deck.length);

    const { useEvent } = useKeymap({ shuffle: { input: "s" }, delete: { input: "dd" } });

    useEvent("shuffle", () => {
        dispatch(Slice.Actions.shuffleActiveDeck(deck));
    });

    useEvent("delete", () => {
        if (!deck.length) return;

        const id = deck[control.currentIndex]!.id;
        dispatch(Slice.Actions.deleteQuestionFromActiveDeck(id));
    });

    return (
        <Box height="100" width="100" flexDirection="column">
            <Box height={1} width="100" flexShrink={0}>
                <Box width="100" height="100">
                    <Text color={Colors.Primary}>Question</Text>
                </Box>
                <Box width="100" height="100" flexShrink={FlexShrinkColumns.Path}>
                    <Text color={Colors.Primary}>Topic</Text>
                </Box>
            </Box>
            <HorizontalLine color={Colors.Primary} />
            <List listView={listView}>
                {deck.map((question) => {
                    return <ActiveListItem key={question.id} question={question} />;
                })}
            </List>
        </Box>
    );
}

function ActiveListItem({ question }: { question: QuizQuestion }): React.ReactNode {
    const dispatch = useAppDispatch();
    const { isFocus, onFocus } = useListItem();

    onFocus(() => {
        dispatch(Slice.Actions.setPreview(question));
    });

    const pathColor = Colors.Secondary;
    const questionColor = Colors.Alt;

    const textColor = (color: Color) => (isFocus ? undefined : color);
    const bgColor = (color: Color) => (isFocus ? color : undefined);

    return (
        <Box height={1} flexShrink={0} width="100">
            <Box height="100" width="100" backgroundColor={bgColor(questionColor)}>
                <Text wrap="truncate-end" color={textColor(questionColor)}>
                    {question.question}
                </Text>
            </Box>
            <Box
                height="100"
                width="100"
                backgroundColor={bgColor(pathColor)}
                flexShrink={3}
            >
                <Text wrap="truncate-end" color={textColor(pathColor)}>
                    {question.path}
                </Text>
            </Box>
        </Box>
    );
}

function Preview(): React.ReactNode {
    const question = useAppSelector(Slice.Selectors.preview);

    return <PreviewColumn nextQuestion={question} nextTopic={null} />;
}
