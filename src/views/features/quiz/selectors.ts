import { RootState } from "../../store/store.js";
import { createSelector } from "@reduxjs/toolkit";

export const questions = (state: RootState) => state.quiz.questions;
export const stats = createSelector([questions], (questions) => {
    let unanswered = 0;
    let correct = 0;
    let incorrect = 0;

    questions.forEach((question) => {
        question.status === "unanswered" && ++unanswered;
        question.status === "correct" && ++correct;
        question.status === "incorrect" && ++incorrect;
    });

    return {
        unanswered,
        correct,
        incorrect,
    };
});
