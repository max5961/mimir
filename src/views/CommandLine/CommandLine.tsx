import React from "react";
import { Box, Cli, Commands, logger } from "tuir";
import { useAppDispatch, useAppSelector } from "../store/store.js";
import { TopicModel } from "../../models/TopicModel.js";
import * as ExpSlice from "../features/explorer/explorerSlice.js";

export default function CommandLine(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { currentTopic, currentIndex } = useAppSelector(ExpSlice.Selectors.CommandLine);

    const commands: Commands = {
        ["mkdir"]: async (args) => {
            if (args.length) {
                dispatch(
                    ExpSlice.Actions.postTopic({
                        names: args,
                        currentTopicID: currentTopic.id,
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
                    targetID: target.id,
                    destination: args[1],
                }),
            );
        },
        DEFAULT: (args) => {
            return Promise.reject("Unknown command: " + args[0]);
        },
    };

    return (
        <Box height={1} width="100">
            <Cli
                commands={commands}
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
