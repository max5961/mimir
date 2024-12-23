import { Box, Cli, Commands } from "phileas";
import React from "react";

const commands: Commands = {
    foo: (args) => {
        return "Foo command";
    },
    DEFAULT: (args) => {
        return Promise.reject("Unknown command: " + args[0]);
    },
};

export function CommandLine(): React.ReactNode {
    return (
        <Box height={1} width="100">
            <Cli
                commands={commands}
                prompt="~ ❯ "
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
