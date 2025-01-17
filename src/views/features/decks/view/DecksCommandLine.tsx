import React from "react";
import { Cli, CliConfig } from "tuir";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { Colors } from "../../../globals.js";
import * as Slice from "../decksSlice.js";

export default function DecksCommandLine(): React.ReactNode {
    const dispatch = useAppDispatch();
    const message = useAppSelector(Slice.Selectors.message);
    const activeDeck = useAppSelector(Slice.Selectors.activeDeck);

    const config: CliConfig = {
        commands: {
            ["save"]: (args) => {
                if (!args.length) {
                    return Promise.reject("Provide a name to save the deck as!");
                }

                // dispatch(
                //     Slice.Actions.saveDeckAs({
                //         activeDeck,
                //         name: args[0]
                //     }),
                // );
            },
        },
        prompts(setValue) {
            return [
                {
                    prompt: "Do you really want to clear the active deck? [y/n]: ",
                    keyinput: { input: "cc" },
                    handler(_, rawinput) {
                        if (rawinput.toUpperCase() === "Y") {
                            dispatch(Slice.Actions.clearActiveDeck());
                        }
                    },
                },
            ];
        },
    };

    return (
        <Cli
            config={config}
            message={message}
            promptStyles={{
                color: Colors.Alt,
            }}
            resolveStyles={{
                color: Colors.Primary,
            }}
            rejectStyles={{
                color: Colors.Error,
            }}
        />
    );
}
