import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveDeck, Decks, QuizQuestion } from "../../../models/DeckModel.js";
import { name } from "./sliceName.js";
import * as Thunks from "./thunks.js";
import { shuffle } from "./shuffle.js";

type State = Decks & {
    preview: QuizQuestion | null;
};

const initialState: State = {
    active: [],
    saved: [],
    preview: null,
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
            .addCase(
                Thunks.getActiveDeck.fulfilled,
                (state: State, action: PayloadAction<ActiveDeck | undefined>) => {
                    if (!action.payload) return;
                    state.active = action.payload;
                },
            )
            .addCase(
                Thunks.shuffleActiveDeck.fulfilled,
                (state: State, action: PayloadAction<ActiveDeck | undefined>) => {
                    if (!action.payload) return;
                    state.active = action.payload;
                },
            );
    },
});

export default decksSlice.reducer;
export * as Selectors from "./selectors.js";
export const Actions = { ...decksSlice.actions, ...Thunks };
