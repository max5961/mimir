import { RootState } from "../../store/store.js";

export const activeDeck = (state: RootState) => state.decks.active;
export const preview = (state: RootState) => state.decks.preview;
export const message = (state: RootState) => state.decks.message;
