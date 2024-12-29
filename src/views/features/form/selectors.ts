import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store.js";

export const QuestionInput = createSelector(
    [
        (state: RootState) => state.form.question.id,
        (state: RootState) => state.form.question.type,
        (state: RootState) => state.form.question.question,
        (state: RootState) => state.form.question.answer,
        (state: RootState) => state.form.question.A,
        (state: RootState) => state.form.question.B,
        (state: RootState) => state.form.question.C,
        (state: RootState) => state.form.question.D,
    ],
    (id, type, question, answer, A, B, C, D) => {
        return {
            id,
            type,
            question,
            answer,
            A,
            B,
            C,
            D,
        };
    },
);

export const AnswerInput = createSelector(
    [
        (state: RootState) => state.form.question.type,
        (state: RootState) => state.form.question.A,
        (state: RootState) => state.form.question.B,
        (state: RootState) => state.form.question.C,
        (state: RootState) => state.form.question.D,
        (state: RootState) => state.form.errors.invalidMcAnswer,
    ],
    (type, A, B, C, D, invalidMcAnswer) => {
        return { type, A, B, C, D, invalidMcAnswer };
    },
);

export const McInput = createSelector(
    [
        (state: RootState) => state.form.question.type,
        (state: RootState) => state.form.question.A,
        (state: RootState) => state.form.question.B,
        (state: RootState) => state.form.question.C,
        (state: RootState) => state.form.question.D,
        (state: RootState) => state.form.errors.invalidMcInput.a,
        (state: RootState) => state.form.errors.invalidMcInput.b,
        (state: RootState) => state.form.errors.invalidMcInput.c,
        (state: RootState) => state.form.errors.invalidMcInput.d,
    ],
    (type, A, B, C, D, aErr, bErr, cErr, dErr) => {
        return { type, A, B, C, D, aErr, bErr, cErr, dErr };
    },
);
