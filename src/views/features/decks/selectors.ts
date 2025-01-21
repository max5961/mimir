import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store.js";

export const activeDeck = (state: RootState) => state.decks.active;
export const preview = (state: RootState) => state.decks.preview;
export const message = (state: RootState) => state.decks.message;
export const savedDecks = createSelector(
    [(state: RootState) => state.decks.saved],
    (savedDecks) => {
        return {
            savedDecks: Object.values(savedDecks).map((deck) => {
                return deck;
            }),
        };
    },
);

export const previewSaved = createSelector(
    [(state: RootState) => state.decks.previewSaved],
    (previewSaved) => {
        if (previewSaved === null) return { questions: null };
        return {
            questions: Object.values(previewSaved).map((question) => {
                return question.question;
            }),
        };
    },
);
export const SaveActiveAs = createSelector([activeDeck], (activeDeck) => {
    return { activeDeck };
});
