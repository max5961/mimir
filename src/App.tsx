import React, { ReactNode, useEffect, useState } from "react";
import {
    Box,
    List,
    logger,
    Styles,
    Text,
    TextInput,
    useKeymap,
    useList,
    useListItem,
    useTextInput,
    Viewport,
} from "phileas";
import { Topic } from "./server/model.js";
import TopicService from "./services/TopicService.js";
import { ROOT_TOPIC } from "./root.js";

const BASE_COLOR = "green";

export default function App(): React.ReactNode {
    const [state, setState] = useState({
        stack: [] as string[],
        topic: ROOT_TOPIC,
        topics: [] as Topic["topics"],
        questions: [] as Topic["questions"],
    });

    const fetch = {
        async getTopic() {
            const topic: Topic = await TopicService.getTopic(state.topic.id);

            setState({
                stack: [],
                topic: topic,
                topics: topic.topics,
                questions: topic.questions,
            });
        },
        async postTopic(topicName: string) {
            const nextTopic: Topic = await TopicService.postTopic(
                state.topic.id,
                topicName,
            );

            setState({
                stack: ["/"],
                topic: nextTopic,
                topics: nextTopic.topics,
                questions: nextTopic.questions,
            });
        },
    };

    useEffect(() => {
        fetch.getTopic();
    }, []);

    const { listView, control } = useList(
        state.topics.length + state.questions.length + 1,
    );

    const { useEvent } = useKeymap({
        enterTopic: [{ key: "return" }, { input: "l" }],
        prevTopic: [{ key: "backspace" }, { input: "h" }],
    });

    useEvent("enterTopic", async () => {
        const nextTopicId = state.topics[control.currentIndex].id;
        const nextTopic: Topic = await TopicService.getTopic(nextTopicId);

        setState({
            stack: ["/"],
            topic: nextTopic,
            topics: nextTopic.topics,
            questions: nextTopic.questions,
        });
    });

    const styles: Styles["Box"] = {
        height: "100",
        width: "100",
        borderStyle: "round",
        borderColor: BASE_COLOR,
    } as const;

    return (
        <Viewport>
            <Box
                styles={styles}
                titleTopLeft={{ title: state.title, color: styles.borderColor }}
            >
                <List listView={listView}>
                    {state.topics.map((topic) => {
                        return <TopicView key={topic.id} topic={topic} />;
                    })}
                    {state.questions.map((question) => {
                        return (
                            <QuestionView
                                key={question.id}
                                question={question}
                            />
                        );
                    })}
                    <AddButton
                        post={(value) => {
                            fetch.postTopic(value);
                        }}
                    />
                </List>
            </Box>
            <Box
                styles={styles}
                flexDirection="column"
                titleTopCenter={{ title: "Preview", color: styles.borderColor }}
            >
                <Preview
                    topic={state.topic}
                    currentIndex={control.currentIndex}
                />
            </Box>
        </Viewport>
    );
}

type TopicProps = {
    topic: Topic;
};

function TopicView({ topic }: TopicProps): React.ReactNode {
    const { isFocus } = useListItem();

    return <TopicText name={topic.name} isFocus={isFocus} />;
}

function TopicText({
    name,
    isFocus,
    colorize = true,
}: {
    name: string;
    isFocus: boolean;
    colorize?: boolean;
}): React.ReactNode {
    const bgColor = isFocus && colorize ? "magenta" : undefined;
    const baseColor = colorize ? BASE_COLOR : undefined;

    return (
        <Box width="100" backgroundColor={bgColor}>
            <Text color={isFocus ? undefined : "white"} wrap="truncate-end">
                {"☰ "}
            </Text>
            <Text
                bold
                color={isFocus ? undefined : baseColor}
                wrap="truncate-end"
            >
                {name}
            </Text>
        </Box>
    );
}

type QuestionProps = {
    question: Topic["questions"][number];
};

function QuestionView({ question }: QuestionProps): React.ReactNode {
    const { isFocus } = useListItem();

    return <QuestionText name={question.question} isFocus={isFocus} />;
}

function QuestionText({
    name,
    isFocus,
    colorize = true,
}: {
    name: string;
    isFocus: boolean;
    colorize?: boolean;
}): React.ReactNode {
    const bgColor = isFocus && colorize ? "magenta" : undefined;
    const baseColor = colorize ? BASE_COLOR : undefined;

    return (
        <Box width="100" backgroundColor={bgColor}>
            <Text color={isFocus ? undefined : "white"} wrap="truncate-end">
                {isFocus ? "● " : "○ "}
            </Text>
            <Text
                italic
                dimColor
                color={isFocus ? undefined : baseColor}
                wrap="truncate-end"
            >
                {name}
            </Text>
        </Box>
    );
}

function AddButton({ post }: { post: (val: string) => void }): React.ReactNode {
    const { isFocus } = useListItem();
    const color = isFocus ? "magenta" : undefined;

    const { onChange, setValue, insert } = useTextInput("");

    const onEnter = () => setValue("");

    const onExit = (value: string) => {
        post(value);
    };

    return (
        <Box width="100" flexDirection="row" backgroundColor={color}>
            {!insert && (
                <Box height={1} width="100" backgroundColor={color}>
                    <Text wrap="truncate-end">Add Question: </Text>
                </Box>
            )}
            <Box height={1} width="100" display={insert ? "flex" : "none"}>
                <TextInput
                    onChange={onChange}
                    onEnter={onEnter}
                    onExit={onExit}
                />
            </Box>
        </Box>
    );
}

function Preview({
    topic,
    currentIndex,
}: {
    topic: Topic;
    currentIndex: number;
}): React.ReactNode {
    if (currentIndex < topic.topics.length) {
        return (
            <Box width="100" height="100" flexDirection="column">
                {topic.topics[currentIndex].topics.map((topic) => {
                    return (
                        <TopicText
                            key={topic.id}
                            name={topic.name}
                            isFocus={false}
                            colorize={false}
                        />
                    );
                })}
                {topic.topics[currentIndex].questions.map((question) => {
                    return (
                        <QuestionText
                            key={question.id}
                            name={question.question}
                            isFocus={false}
                            colorize={false}
                        />
                    );
                })}
            </Box>
        );
    }

    if (currentIndex < topic.topics.length + topic.questions.length) {
        const question = topic.questions[currentIndex - topic.topics.length];

        return (
            <Box height="100" width="100" flexDirection="column">
                <Box
                    width="100"
                    borderStyle="round"
                    titleTopCenter={{ title: "Question Type" }}
                >
                    <Text>{question.type}</Text>
                </Box>
                <Box
                    width="100"
                    borderStyle="round"
                    titleTopCenter={{ title: "Question" }}
                >
                    <Text>{question.question}</Text>
                </Box>
                <Box
                    width="100"
                    borderStyle="round"
                    titleTopCenter={{ title: "Answer" }}
                >
                    <Text>{question.answer}</Text>
                </Box>
                {question.A && (
                    <Box width="100" borderStyle="round">
                        <Text>{`A: ${question.A}`}</Text>
                    </Box>
                )}
                {question.B && (
                    <Box width="100" borderStyle="round">
                        <Text>{`B: ${question.B}`}</Text>
                    </Box>
                )}
                {question.C && (
                    <Box width="100" borderStyle="round">
                        <Text>{`C: ${question.C}`}</Text>
                    </Box>
                )}
                {question.D && (
                    <Box width="100" borderStyle="round">
                        <Text>{`D: ${question.D}`}</Text>
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box height="100" width="100">
            <Box borderStyle="round" width="100" height={3} borderColor="green">
                <Text wrap="truncate-end" color="green">
                    Add Question
                </Text>
            </Box>
        </Box>
    );
}
