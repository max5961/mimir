import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveDeck, Decks, QuizQuestion } from "../../../models/DeckModel.js";
import { name } from "./sliceName.js";
import * as Thunks from "./thunks.js";
import { CliMessage } from "tuir";

type State = Decks & {
    preview: QuizQuestion | null;
    message?: CliMessage;
};

const initialState: State = {
    active: [],
    saved: {},
    preview: null,
    message: undefined,
};

const decksSlice = createSlice({
    name,
    initialState,
    reducers: {
        setPreview(state: State, action: PayloadAction<QuizQuestion | null>) {
            state.preview = action.payload;
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
            );
    },
});

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
