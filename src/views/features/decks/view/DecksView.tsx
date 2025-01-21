import React, { useEffect } from "react";
import { Box, Node, Styles, Text, useKeymap, useNode, useNodeMap, usePage } from "tuir";
import { Colors } from "../../../globals.js";
import DecksCommandLine from "./DecksCommandLine.js";
import { useAppDispatch } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { ActiveDeck } from "./ActiveDeck.js";
import { Preview } from "./Preview.js";
import { ModifySavedDecks } from "./ModifySavedDecks.js";

const boxStyles: Styles["Box"] = {
    height: "100",
    width: "100",
    borderColor: Colors.Primary,
    borderStyle: "round",
};

export default function DecksView(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { onPageBlur } = usePage();

    useEffect(() => {
        dispatch(Slice.Actions.getActiveDeck());
        dispatch(Slice.Actions.getSavedDecks());
    }, []);

    const { register, control } = useNodeMap([["activeDeck", "previewAndSavedDecks"]], {
        navigation: "none",
    });

    const { useEvent } = useKeymap({
        left: { input: "h" },
        right: { input: "l" },
    });

    useEvent("left", () => {
        control.goToNode("activeDeck");
    });

    useEvent("right", () => {
        control.goToNode("previewAndSavedDecks");
    });

    onPageBlur(() => {
        control.goToNode("activeDeck");
    });

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
                <Node.Box
                    styles={boxStyles}
                    {...register("activeDeck")}
                    borderColor={
                        control.getCurrentIndex() === 0
                            ? boxStyles.borderColor
                            : Colors.ShallowFocus
                    }
                >
                    <ActiveDeck />
                </Node.Box>
                <Node.Box
                    height="100"
                    width="100"
                    flexShrink={1.6}
                    {...register("previewAndSavedDecks")}
                >
                    <PreviewAndSavedDecks />
                </Node.Box>
            </Box>
            <DecksCommandLine />
        </Box>
    );
}

function PreviewAndSavedDecks(): React.ReactNode {
    const { isFocus } = useNode();

    if (isFocus) {
        return <ModifySavedDecks />;
    } else {
        return <Preview />;
    }
}
