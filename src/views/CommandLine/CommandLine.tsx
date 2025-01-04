import React from "react";
import { Box, Cli, Commands, logger } from "tuir";
import { useAppDispatch, useAppSelector } from "../store/store.js";
import { TopicModel } from "../../models/TopicModel.js";
import * as ExpSlice from "../features/explorer/explorerSlice.js";
import * as CliSlice from "../features/cli/cliSlice.js";

export default function CommandLine(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { currentTopic, currentIndex, nextTopic, nextQuestion } = useAppSelector(
        ExpSlice.Selectors.CommandLine,
    );
    const { message } = useAppSelector(CliSlice.Selectors.selectMessage);

    const commands: Commands = {
        ["mkdir"]: async (args) => {
            if (args.length) {
                dispatch(
                    ExpSlice.Actions.postTopic({
                        newTopicNames: args,
                        topicID: currentTopic.id,
                    }),
                );
            }
        },
        ["mv"]: async (args) => {
            if (!args[0] || !args[1]) return Promise.reject("mv: missing arguments");

            let target: TopicModel | undefined = currentTopic.subTopics[currentIndex];
            if (!args[0].match(/^"\$|^'\$|^\$/)) {
                target = currentTopic.subTopics.find(
                    (subTopic) => subTopic.name === args[0],
                );

                if (!target) {
                    return Promise.reject("mv: invalid target");
                }
            }

            dispatch(
                ExpSlice.Actions.moveTopic({
                    cwdID: currentTopic.id,
                    subTopicID: target.id,
                    destination: args[1],
                }),
            );
        },
        ["delete"]: async (args) => {
            const force = args.includes("--force") || args.includes("-f");

            if (nextTopic) {
                if (nextTopic.subTopics.length || nextTopic.questions.length) {
                    if (!force) {
                        return Promise.reject(
                            "Topic is not empty.  Use the --force flag",
                        );
                    }
                }

                return dispatch(
                    ExpSlice.Actions.deleteTopic({
                        topicID: currentTopic.id,
                        subTopicID: nextTopic.id,
                    }),
                );
            }

            if (nextQuestion) {
                dispatch(
                    ExpSlice.Actions.deleteQuestion({
                        topicID: currentTopic.id,
                        questionID: nextQuestion.id,
                    }),
                );
            }
        },
        DEFAULT: (args) => {
            return Promise.reject("Unknown command: " + args[0]);
        },
    };

    return (
        <Box height={1} width="100">
            <Cli
                commands={commands}
                message={message}
                prompt=":"
                rejectStyles={{
                    color: "red",
                }}
                resolveStyles={{
                    color: "green",
                    italic: true,
                }}
                inputStyles={{
                    color: "cyan",
                }}
            />
        </Box>
    );
}
