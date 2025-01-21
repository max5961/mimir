import { createSlice, PayloadAction, StateFromReducersMapObject } from "@reduxjs/toolkit";
import {
    ActiveDeck,
    Decks,
    QuizQuestion,
    SavedDeckStore,
} from "../../../models/DeckModel.js";
import { name } from "./sliceName.js";
import * as Thunks from "./thunks.js";
import { CliMessage } from "tuir";

type State = Decks & {
    preview: QuizQuestion | null;
    previewSaved: QuizQuestion[] | null;
    message?: CliMessage;
};

const initialState: State = {
    active: [],
    saved: {},
    preview: null,
    previewSaved: null,
    message: undefined,
};

const decksSlice = createSlice({
    name,
    initialState,
    reducers: {
        setPreview(state: State, action: PayloadAction<QuizQuestion | null>) {
            state.preview = action.payload;
        },
        setSavedPreview(state: State, action: PayloadAction<QuizQuestion[]>) {
            state.previewSaved = action.payload;
        },
        setActiveDeck(state: State, action: PayloadAction<ActiveDeck>) {
            state.active = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(Thunks.getActiveDeck.fulfilled, updateActiveDeck)
            .addCase(Thunks.shuffleActiveDeck.fulfilled, updateActiveDeck)
            .addCase(Thunks.pushQuestionToActiveDeck.fulfilled, updateActiveDeck)
            .addCase(Thunks.pushTopicToActiveDeck.fulfilled, updateActiveDeck)
            .addCase(Thunks.deleteQuestionFromActiveDeck.fulfilled, updateActiveDeck)
            .addCase(
                Thunks.clearActiveDeck.fulfilled,
                (state: State, action: PayloadAction<ActiveDeck | undefined>) => {
                    updateActiveDeck(state, action);
                    state.message = ["RESOLVE", "Deck cleared"];
                },
            )
            .addCase(Thunks.saveActiveDeckAs.fulfilled, updateSavedDecks)
            .addCase(Thunks.getSavedDecks.fulfilled, updateSavedDecks)
            .addCase(Thunks.deleteSavedDeck.fulfilled, updateSavedDecks)
            .addCase(Thunks.postActiveToSaved.fulfilled, updateSavedDecks);
    },
});

function updateSavedDecks(
    state: State,
    action: PayloadAction<SavedDeckStore | undefined>,
) {
    if (!action.payload) return;
    state.saved = action.payload;
    if (!Object.values(action.payload).length) {
        state.previewSaved = null;
    }
}

function updateActiveDeck(state: State, action: PayloadAction<ActiveDeck | undefined>) {
    if (!action.payload) return;
    state.active = action.payload;
    if (!action.payload.length) {
        state.preview = null;
    }
}

export default decksSlice.reducer;
export * as Selectors from "./selectors.js";
export const Actions = { ...decksSlice.actions, ...Thunks };
