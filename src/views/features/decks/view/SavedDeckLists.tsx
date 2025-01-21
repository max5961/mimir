import React, { useEffect } from "react";
import { Box, List, Text, useKeymap, useList, useListItem, useNode } from "tuir";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { SavedDeck } from "../../../../models/DeckModel.js";
import { Colors } from "../../../globals.js";

export function AddActiveTo(): React.ReactNode {
    const dispatch = useAppDispatch();
    const activeDeck = useAppSelector(Slice.Selectors.activeDeck);

    return (
        <SavedList
            title="Add Active To:"
            handleChoose={(currDeck) => {
                return () => {
                    dispatch(
                        Slice.Actions.postActiveToSaved({
                            targetID: currDeck.id,
                            activeDeck,
                        }),
                    );
                };
            }}
            handleDelete={(currDeck) => {
                return () => {
                    dispatch(Slice.Actions.deleteSavedDeck(currDeck.id));
                };
            }}
        />
    );
}

export function LoadSavedDeck(): React.ReactNode {
    const dispatch = useAppDispatch();

    return (
        <SavedList
            title="Load Saved Deck:"
            handleChoose={(currDeck) => {
                return () => {
                    dispatch(Slice.Actions.setActiveDeck([...currDeck.deck]));
                };
            }}
            handleDelete={(currDeck) => {
                return () => {
                    dispatch(Slice.Actions.deleteSavedDeck(currDeck.id));
                };
            }}
        />
    );
}

function SavedList({
    title,
    handleChoose,
    handleDelete,
}: {
    title: string;
    handleChoose: (deck: SavedDeck) => () => void;
    handleDelete: (deck: SavedDeck) => () => void;
}): React.ReactNode {
    const { savedDecks } = useAppSelector(Slice.Selectors.savedDecks);
    const node = useNode();
    const { listView, control } = useList(savedDecks.length, {
        navigation: "none",
    });

    const { useEvent } = useKeymap({
        up: [{ input: "k" }, { key: "up" }],
        down: [{ input: "j" }, { key: "down" }],
        goToTop: { input: "gg" },
        goToBottom: { input: "G" },
        choose: { key: "return" },
        delete: { input: "dd" },
    });

    useEvent("up", () => {
        if (control.currentIndex === 0) {
            return node.control.up();
        }
        control.prevItem();
    });

    useEvent("down", () => {
        if (control.currentIndex === savedDecks.length - 1) {
            return node.control.down();
        }
        control.nextItem();
    });
    useEvent("goToTop", () => {
        control.goToIndex(0);
    });
    useEvent("goToBottom", () => {
        control.goToIndex(savedDecks.length - 1);
    });

    const currDeck = savedDecks[control.currentIndex];

    useEvent("choose", handleChoose(currDeck));
    useEvent("delete", handleDelete(currDeck));

    const focusColor = node.isFocus ? Colors.Secondary : Colors.ShallowFocus;

    return (
        <Box
            height="100"
            borderStyle="round"
            titleTopLeft={{ title: ` ${title} `, color: focusColor }}
            borderColor={focusColor}
        >
            <List listView={listView} scrollbar={{ color: focusColor }}>
                {savedDecks.map((deck) => {
                    return <SavedListItem key={deck.id} deck={deck} />;
                })}
            </List>
        </Box>
    );
}

function SavedListItem({ deck }: { deck: SavedDeck }): React.ReactNode {
    const dispatch = useAppDispatch();
    const { isFocus, onFocus } = useListItem();

    const setSaved = () => dispatch(Slice.Actions.setSavedPreview([...deck.deck]));

    onFocus(setSaved);

    useEffect(() => {
        if (isFocus) {
            setSaved();
        }
    }, [deck]);

    const focusColor = isFocus ? Colors.Secondary : undefined;

    return (
        <Box height={1} width="100" backgroundColor={focusColor}>
            <Text wrap="truncate-end">{deck.name}</Text>
        </Box>
    );
}
