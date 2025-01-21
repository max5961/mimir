import React from "react";
import {
    Box,
    HorizontalLine,
    Node,
    Styles,
    Text,
    TextInput,
    useKeymap,
    useNode,
    useNodeMap,
    useTextInput,
} from "tuir";
import { Colors } from "../../../globals.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { AddActiveTo, LoadSavedDeck } from "./SavedDeckLists.js";
import { PreviewCurrentSaved } from "./Preview.js";

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
            <Box width="100" height="40" flexShrink={0}>
                <SavedDecksList />
            </Box>
            <Box width="100" height="60" flexShrink={0} flexDirection="column">
                <HorizontalLine color={color} dimColor />
                <PreviewCurrentSaved />
            </Box>
        </Box>
    );
}

function SavedDecksList(): React.ReactNode {
    const { register, control } = useNodeMap(
        [["saveActiveAs"], ["loadSaved"], ["addActiveTo"]],
        {
            navigation: "none",
        },
    );

    return (
        <Box flexBasis="100" flexDirection="column">
            <Node {...register("saveActiveAs")}>
                <SaveActiveAs />
            </Node>
            <Node.Box {...register("loadSaved")} height="100">
                <LoadSavedDeck />
            </Node.Box>
            <Node.Box {...register("addActiveTo")} height="100">
                <AddActiveTo />
            </Node.Box>
        </Box>
    );
}

function SaveActiveAs(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { activeDeck } = useAppSelector(Slice.Selectors.SaveActiveAs);
    const { isFocus, control } = useNode();
    const { onChange, setValue } = useTextInput();

    const { useEvent } = useKeymap({ down: [{ input: "j" }, { key: "down" }] });
    useEvent("down", () => control.down());

    const color = isFocus ? Colors.Secondary : Colors.ShallowFocus;
    const borderStyle: Styles["Box"]["borderStyle"] = isFocus ? "double" : "round";

    const onExit = (value: string) => {
        if (!value) return;
        dispatch(Slice.Actions.saveActiveDeckAs({ name: value, activeDeck }));
        setValue("");
    };

    return (
        <Box
            borderStyle={borderStyle}
            borderColor={color}
            height={3}
            flexShrink={0}
            width="100"
            flexDirection="row"
            marginBottom={1}
        >
            <Box flexShrink={0}>
                <Text>{"Save Active As: "}</Text>
            </Box>
            <Box>
                <TextInput onChange={onChange} onExit={onExit} />
            </Box>
        </Box>
    );
}
