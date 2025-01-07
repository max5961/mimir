import { QuestionModel } from "./QuestionModel.js";

export type QuizQuestion = QuestionModel & { path: string };

export type ActiveDeck = QuizQuestion[];

export type SavedDeck = { id: string; name: string; playlist: QuizQuestion[] };

export type Decks = {
    active: QuizQuestion[];
    saved: SavedDeck[];
};
