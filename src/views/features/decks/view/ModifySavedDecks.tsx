import React from "react";
import {
    Box,
    HorizontalLine,
    Node,
    Text,
    TextInput,
    useKeymap,
    useNode,
    useNodeMap,
    useTextInput,
} from "tuir";
import { Colors } from "../../../globals.js";

export function ModifySavedDecks(): React.ReactNode {
    const color = Colors.Secondary;

    return (
        <Box
            flexBasis="100"
            flexDirection="column"
            borderStyle="double"
            borderColor={color}
            titleTopCenter={{ title: " Saved Decks ", color }}
        >
            <Box flexBasis="100" flexShrink={2.5}>
                <SavedDecksList />
            </Box>
            <HorizontalLine color={color} dimColor />
            <Box flexBasis="100"></Box>
        </Box>
    );
}

function SavedDecksList(): React.ReactNode {
    const { register, control } = useNodeMap([["add-current"], ["saved-list"]], {
        navigation: "none",
    });

    const { useEvent } = useKeymap({ down: { input: "j" }, up: { input: "k" } });

    useEvent("up", () => control.up());
    useEvent("down", () => control.down());

    return (
        <Box flexBasis="100" flexDirection="column">
            <Node {...register("add-current")}>
                <AddCurrent />
            </Node>
            <Node {...register("saved-list")}>
                <SavedLists />
            </Node>
            <PreviewCurrentSaved />
        </Box>
    );
}

function AddCurrent(): React.ReactNode {
    const { isFocus } = useNode();
    const { onChange } = useTextInput();

    const color = isFocus ? Colors.Primary : Colors.Secondary;

    return (
        <Box
            borderStyle="round"
            borderColor={color}
            height={3}
            flexShrink={0}
            width="100"
            flexDirection="row"
            marginBottom={1}
        >
            <Box flexShrink={0}>
                <Text>{"Save Current: "}</Text>
            </Box>
            <Box>
                <TextInput onChange={onChange} />
            </Box>
        </Box>
    );
}

function SavedLists(): React.ReactNode {
    return <Box flexBasis="100"></Box>;
}

function PreviewCurrentSaved(): React.ReactNode {
    return <Box flexBasis="100"></Box>;
}
