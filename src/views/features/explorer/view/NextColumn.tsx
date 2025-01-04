import React from "react";
import { Box, Text, HorizontalLine } from "tuir";
import { Colors } from "../../../globals.js";
import { useAppSelector } from "../../../store/store.js";
import { EStyles } from "./style.js";
import TopicListItem from "./TopicListItem.js";
import QuestionListItem from "./QuestionListItem.js";
import * as Slice from "../explorerSlice.js";

export default function NextColumn(): React.ReactNode {
    const { nextTopic, nextQuestion } = useAppSelector(Slice.Selectors.NextColumn);

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
                    {!nextQuestion.a && (
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
                    {nextQuestion.a && (
                        <Text
                            color={
                                nextQuestion.multipleChoiceAnswer === nextQuestion.a.id
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`A: ${nextQuestion.a.value}`}</Text>
                    )}
                    {nextQuestion.b && (
                        <Text
                            color={
                                nextQuestion.multipleChoiceAnswer === nextQuestion.b.id
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`B: ${nextQuestion.b.value}`}</Text>
                    )}
                    {nextQuestion.c && (
                        <Text
                            color={
                                nextQuestion.multipleChoiceAnswer === nextQuestion.c.id
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`C: ${nextQuestion.c.value}`}</Text>
                    )}
                    {nextQuestion.d && (
                        <Text
                            color={
                                nextQuestion.multipleChoiceAnswer === nextQuestion.d.id
                                    ? Colors.Primary
                                    : undefined
                            }
                        >{`D: ${nextQuestion.d.value}`}</Text>
                    )}
                </>
            )}
        </Box>
    );
}
