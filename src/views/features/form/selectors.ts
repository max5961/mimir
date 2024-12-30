import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store.js";
import { logger } from "phileas";

export const opts = createSelector(
    [
        (state: RootState) => state.form.question.a,
        (state: RootState) => state.form.question.b,
        (state: RootState) => state.form.question.c,
        (state: RootState) => state.form.question.d,
    ],
    (a, b, c, d) => {
        return { a, b, c, d };
    },
);

export const invalidOpts = createSelector(
    [
        (state: RootState) => state.form.errors.opts.a,
        (state: RootState) => state.form.errors.opts.b,
        (state: RootState) => state.form.errors.opts.c,
        (state: RootState) => state.form.errors.opts.d,
    ],
    (a, b, c, d) => {
        return { a, b, c, d };
    },
);

export const questionType = (state: RootState) => state.form.question.type;
export const questionID = (state: RootState) => state.form.question.id;
export const question = (state: RootState) => state.form.question.question;
export const answer = (state: RootState) => state.form.question.answer;
export const multipleChoiceDropDownError = (state: RootState) =>
    state.form.errors.multipleChoiceDropDown;
export const multipleChoiceAnswer = (state: RootState) =>
    state.form.question.multipleChoiceAnswer;
export const questionInputReturnAction = (state: RootState) =>
    state.form.questionInputReturnAction;
export const answerInputReturnAction = (state: RootState) =>
    state.form.answerInputReturnAction;

export const takenQuestionNames = createSelector(
    [(state: RootState) => state.explorer.topicData.currentTopic.questions],
    (questions) => {
        const set = new Set<string>();
        questions.forEach((question) => set.add(question.question));
        return set;
    },
);

export const Form = createSelector([questionType, opts], (type, opts) => {
    return {
        type,
        opts,
    };
});

export const AnswerInput = createSelector([Form], (form) => {
    return {
        type: form.type,
        opts: form.opts,
    };
});

export const MultipleChoice = createSelector(
    [questionType, opts],
    (questionType, opts) => {
        return {
            questionType,
            opts,
        };
    },
);

export const Opt = createSelector([opts, invalidOpts], (opts, invalidOpts) => {
    return { opts, invalidOpts };
});

export const DropDown = createSelector(
    [opts, multipleChoiceAnswer],
    (opts, multipleChoiceAnswer) => {
        const visibleOpts = Object.values(opts)
            .filter((opt) => opt !== undefined)
            .map((_, idx) => String.fromCharCode(65 + idx));

        return {
            opts: visibleOpts,
            multipleChoiceAnswer,
        };
    },
);
