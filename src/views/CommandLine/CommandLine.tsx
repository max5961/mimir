import React from "react";
import { Box, Cli, Commands, logger } from "phileas";
import { useAppDispatch, useAppSelector } from "../store/store.js";
import {
    moveTopic,
    postTopic,
    selectCommandLine,
} from "../features/explorer/explorerSlice.js";
import { TopicModel } from "../../models/TopicModel.js";

export function CommandLine(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { currentTopic, currentIndex } = useAppSelector(selectCommandLine);

    const commands: Commands = {
        ["mkdir"]: async (args) => {
            if (args.length) {
                dispatch(
                    postTopic({
                        names: args,
                        currentTopicID: currentTopic.id,
                    }),
                );
            }
        },
        ["mv"]: async (args) => {
            if (!args[0] || !args[1]) return Promise.reject("mv: missing arguments");

            let target: TopicModel | undefined = currentTopic.subTopics[currentIndex];
            logger.write(currentIndex);
            if (!args[0]?.match(/^"\$|^'\$|^\$/)) {
                target = currentTopic.subTopics.find(
                    (subTopic) => subTopic.name === args[0],
                );

                if (!target) {
                    return Promise.reject("mv: invalid target");
                }
            }

            dispatch(
                moveTopic({
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
