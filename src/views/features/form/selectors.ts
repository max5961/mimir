import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store.js";

// Question data
export const questionType = (state: RootState) => state.form.question.type;
export const questionID = (state: RootState) => state.form.question.id;
export const question = (state: RootState) => state.form.question.question;
export const answer = (state: RootState) => state.form.question.answer;
export const multipleChoiceAnswer = (state: RootState) =>
    state.form.question.multipleChoiceAnswer;
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

// ReturnActions
export const questionInputReturnAction = (state: RootState) =>
    state.form.questionInputReturnAction;
export const answerInputReturnAction = (state: RootState) =>
    state.form.answerInputReturnAction;

// Errors
export const showErrorsModal = (state: RootState) => state.form.showErrorsModal;
export const emptyMcSelection = (state: RootState) => state.form.errors.emptyMcSelection;
export const emptyQuestionInput = (state: RootState) =>
    state.form.errors.emptyQuestionInput;
export const emptyAnswerInput = (state: RootState) => state.form.errors.emptyAnswerInput;
export const duplicateQuestionName = (state: RootState) =>
    state.form.errors.duplicateQuestionName;
export const emptyOpts = createSelector(
    [
        (state: RootState) => state.form.errors.emptyOpts.a,
        (state: RootState) => state.form.errors.emptyOpts.b,
        (state: RootState) => state.form.errors.emptyOpts.c,
        (state: RootState) => state.form.errors.emptyOpts.d,
    ],
    (a, b, c, d) => {
        return { a, b, c, d };
    },
);
export const duplicateOpts = createSelector(
    [
        (state: RootState) => state.form.errors.duplicateOpts.a,
        (state: RootState) => state.form.errors.duplicateOpts.b,
        (state: RootState) => state.form.errors.duplicateOpts.c,
        (state: RootState) => state.form.errors.duplicateOpts.d,
    ],
    (a, b, c, d) => {
        return { a, b, c, d };
    },
);

export const justAdded = createSelector(
    [
        (state: RootState) => state.form.justAdded.a,
        (state: RootState) => state.form.justAdded.b,
        (state: RootState) => state.form.justAdded.c,
        (state: RootState) => state.form.justAdded.d,
    ],
    (a, b, c, d) => {
        return { a, b, c, d };
    },
);

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

export const QuestionInput = createSelector(
    [
        (state: RootState) => state.form.existingQuestionNames,
        questionInputReturnAction,
        duplicateQuestionName,
        emptyQuestionInput,
        question,
    ],
    (
        existingQuestionNames,
        questionInputReturnAction,
        duplicateQuestionName,
        emptyQuestionInput,
        question,
    ) => {
        return {
            existingNamesSet: new Set(existingQuestionNames),
            returnAction: questionInputReturnAction,
            hasErrors: duplicateQuestionName || emptyQuestionInput,
            question,
        };
    },
);

export const AnswerInput = createSelector(
    [Form, answerInputReturnAction, emptyAnswerInput, answer],
    (form, answerInputReturnAction, emptyAnswerInput, answer) => {
        return {
            type: form.type,
            opts: form.opts,
            returnAction: answerInputReturnAction,
            hasErrors: emptyAnswerInput,
            answer,
        };
    },
);

export const MultipleChoice = createSelector(
    [questionType, opts],
    (questionType, opts) => {
        return {
            questionType,
            opts,
        };
    },
);

export const Opt = createSelector(
    [opts, emptyOpts, duplicateOpts, justAdded],
    (opts, emptyOpts, duplicateOpts, justAdded) => {
        return {
            justAdded,
            opts,
            hasErrors(name: string) {
                return emptyOpts[name] || duplicateOpts[name];
            },
        };
    },
);

export const AddButton = createSelector([opts, justAdded], (opts, justAdded) => {
    return { opts, justAdded };
});

export const DropDown = createSelector([opts, multipleChoiceAnswer], (opts, answerId) => {
    const visibleOpts = Object.values(opts)
        .filter((opt) => opt !== undefined)
        .map((opt, idx) => {
            return { ...opt, value: `${String.fromCharCode(idx + 65)}: ${opt.value}` };
        });

    return {
        opts: visibleOpts,
        answerId,
    };
});

export const ErrorsModal = (state: RootState) => state.form.errors;

export const All = (state: RootState) => state.form;

export const SubmitButton = (state: RootState) => state.form;
