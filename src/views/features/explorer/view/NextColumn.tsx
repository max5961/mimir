import React from "react";
import { Box, Text, HorizontalLine } from "phileas";
import { Colors } from "../../../globals.js";
import { useAppSelector } from "../../../store/store.js";
import { selectNextColumn } from "../explorerSlice.js";
import { EStyles } from "./style.js";
import TopicListItem from "./TopicListItem.js";
import QuestionListItem from "./QuestionListItem.js";

export default function NextColumn(): React.ReactNode {
    const { nextTopic, nextQuestion } = useAppSelector(selectNextColumn);

    return (
        <Box
            styles={EStyles.ColumnBox}
            titleTopCenter={{ title: "Preview", color: Colors.Primary }}
        >
            {nextTopic && (
                <>
                    {nextTopic.subTopics.map((topic) => {
                        return (
                            <TopicListItem
                                key={topic.id}
                                topic={topic}
                                isFocus={false}
                                dim
                            />
                        );
                    })}
                    {nextTopic.questions.map((question) => {
                        return (
                            <QuestionListItem
                                key={question.id}
                                question={question}
                                isFocus={false}
                                dim
                            />
                        );
                    })}
                </>
            )}
            {nextQuestion && (
                <>
                    <Box
                        width="100"
                        borderStyle="round"
                        borderColor={Colors.Alt}
                        titleTopLeft={{ title: "Question", color: Colors.Alt }}
                        flexShrink={0}
                    >
                        <Text color={Colors.Alt} dimColor>
                            {nextQuestion.question}
                        </Text>
                    </Box>
                    <HorizontalLine dimColor color={Colors.Primary} />
                    {!nextQuestion.A && (
                        <Box
                            width="100"
                            borderStyle="round"
                            borderColor={Colors.Primary}
                            titleTopLeft={{
                                title: `Answer${nextQuestion.type === "qi" ? "─[input]" : ""}`,
                                color: Colors.Primary,
                            }}
                            flexShrink={0}
                        >
                            <Text color={Colors.Primary} dimColor>
                                {nextQuestion.answer}
                            </Text>
                        </Box>
                    )}
                    {nextQuestion.A && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "A"
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`A: ${nextQuestion.A}`}</Text>
                    )}
                    {nextQuestion.B && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "B"
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`B: ${nextQuestion.B}`}</Text>
                    )}
                    {nextQuestion.C && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "C"
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`C: ${nextQuestion.C}`}</Text>
                    )}
                    {nextQuestion.D && (
                        <Text
                            color={
                                nextQuestion.answer.toUpperCase() === "D"
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`D: ${nextQuestion.D}`}</Text>
                    )}
                </>
            )}
        </Box>
    );
}
