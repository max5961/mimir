import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { name } from "./slicename.js";
import { QuizQuestion } from "../../../models/DeckModel.js";

export type Question = QuizQuestion & { status: "correct" | "incorrect" | "unanswered" };

type State = {
    questions: Question[];
};

const initialState: State = {
    questions: [],
};

const quizSlice = createSlice({
    name,
    initialState,
    reducers: {
        setQuestionsArray(state: State, action: PayloadAction<Question[]>) {
            state.questions = action.payload;
        },
        setQuestion(
            state: State,
            action: PayloadAction<{ idx: number; status: Question["status"] }>,
        ) {
            const question = state.questions[action.payload.idx];
            question.status = action.payload.status;
        },
        reset() {
            return initialState;
        },
    },
    extraReducers(builder) {
        //
    },
});

export default quizSlice.reducer;
export * as Selectors from "./selectors.js";
export const Actions = { ...quizSlice.actions };
