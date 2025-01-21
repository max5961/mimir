import React from "react";
import {
    Box,
    HorizontalLine,
    List,
    Node,
    Text,
    useKeymap,
    useList,
    useNodeMap,
    usePage,
    useViewportDimensions,
} from "tuir";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { DynamicQuestionView } from "./DynamicQuestionView.js";
import { Colors } from "../../../globals.js";
import { QuestionStatus } from "./QuestionStatus.js";
import * as Slice from "../quizSlice.js";
import { QuizStats } from "./QuizStats.js";
import { Finale } from "./Finale.js";

export default function Quiz(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { activeDeck, questions } = useAppSelector(Slice.Selectors.quizView);
    const { onPageFocus, onPageBlur } = usePage();

    // list length + 1 to account to finish page
    const { listView, control } = useList(questions.length + 1, {
        navigation: "none",
        windowSize: 1,
        unitSize: "fit-unit",
    });

    const { useEvent } = useKeymap({
        next: [{ input: "l" }, { key: "right" }],
        prev: [{ input: "h" }, { key: "left" }],
    });

    useEvent("next", control.nextItem);
    useEvent("prev", () => {
        if (control.currentIndex < questions.length) {
            control.prevItem();
        }
    });

    onPageFocus(() => {
        dispatch(
            Slice.Actions.setQuestionsArray(
                activeDeck.map((question) => {
                    return { ...question, status: "unanswered" };
                }),
            ),
        );
    });

    onPageBlur(() => {
        dispatch(Slice.Actions.reset());
    });

    const { width } = useViewportDimensions();
    const cardWidth = Math.min(width, 75);
    const progressText = ` Question: ${control.currentIndex + 1}/${questions.length} `;
    const curr = questions[control.currentIndex];

    return (
        <Box
            height="100"
            width="100"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <Box
                width={cardWidth}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                borderStyle="round"
                borderColor={Colors.Primary}
            >
                <Box width="100" flexDirection="column" gap={3} paddingY={1} paddingX={2}>
                    {control.currentIndex < questions.length && (
                        <Box flexDirection="column">
                            <Box
                                height={1}
                                width="100"
                                flexShrink={0}
                                justifyContent="space-between"
                            >
                                <Text>{progressText}</Text>
                                <QuestionStatus status={curr?.status} />
                            </Box>
                            <HorizontalLine dimColor />
                        </Box>
                    )}
                    <Box minHeight={11} width="100">
                        {questions.length ? (
                            <List
                                listView={listView}
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                scrollbar={{ hide: true }}
                                fitY
                            >
                                {questions.map((question) => {
                                    return (
                                        <DynamicQuestionView
                                            key={`${question.id}`}
                                            question={question}
                                        ></DynamicQuestionView>
                                    );
                                })}
                                <Finale
                                    goToStart={() => {
                                        control.goToIndex(0);
                                    }}
                                />
                            </List>
                        ) : (
                            <Text>Add some questions first (2)</Text>
                        )}
                    </Box>
                    <QuizStats />
                </Box>
            </Box>
        </Box>
    );
}
