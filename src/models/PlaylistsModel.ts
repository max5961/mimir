import { QuestionModel } from "./QuestionModel.js";

export type QuizQuestion = QuestionModel & { path: string };

export type ActivePlaylist = QuizQuestion[];

export type SavedPlaylist = { id: string; name: string; playlist: QuizQuestion[] };

export type Playlists = {
    active: QuizQuestion[];
    saved: SavedPlaylist[];
};
