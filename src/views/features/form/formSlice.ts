import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import name from "./sliceName.js";
import { QuestionModel } from "../../../models/QuestionModel.js";
import { randomUUID } from "crypto";

export type OptName = "a" | "b" | "c" | "d";
export type NewQuestion = Omit<QuestionModel, "id">;
// export type MCAnswer = QuestionModel["multipleChoiceAnswer"];
export type OptErrorPayload = { optName: OptName; hasError: boolean };
export type InputReturnAction = "exit" | "new-line";

export type State = {
    // The question we are editing or creating
    question: NewQuestion & { id?: string };

    // What to do when we submit the question
    method: "POST" | "PUT";

    // Used to prevent duplicate question names
    existingQuestionNames: string[];

    // What happens when the user presses CR when entering text?  '\n' or exit insert
    // mode? All other inputs exit insert on CR, but that doesn't allow for multiline
    // input.  Defaults to 'exit' for ease of use, but can toggle to '\n'.
    questionInputReturnAction: InputReturnAction;

    // Same as above
    answerInputReturnAction: InputReturnAction;

    // Form must contain no errors before being submitted
    errors: {
        duplicateQuestionName: boolean;
        duplicateOpts: { [p in "a" | "b" | "c" | "d"]: boolean };
        emptyAnswerInput: boolean;
        emptyQuestionInput: boolean;
        emptyMcSelection: boolean;
        emptyOpts: { [p in "a" | "b" | "c" | "d"]: boolean };
    };
    justAdded: { [p in "a" | "b" | "c" | "d"]: boolean };
    showErrorsModal: boolean;
};

const initialState: State = {
    question: { id: undefined, type: "qa", question: "", answer: "" },
    method: "POST",
    existingQuestionNames: [],
    questionInputReturnAction: "exit",
    answerInputReturnAction: "exit",
    errors: {
        emptyAnswerInput: true,
        emptyQuestionInput: true,
        emptyMcSelection: true, // initializes to 'select', so it always starts in an error state
        emptyOpts: { a: false, b: false, c: false, d: false },
        duplicateOpts: { a: false, b: false, c: false, d: false },
        duplicateQuestionName: false,
    },
    justAdded: {
        a: false,
        b: false,
        c: false,
        d: false,
    },
    showErrorsModal: false,
};

export const sliceName = "questionForm";

const questionSlice = createSlice({
    name,
    initialState,
    reducers: {
        // Popping open the modal with a new question
        createNewQuestion(
            state: State,
            action: PayloadAction<State["existingQuestionNames"]>,
        ) {
            state.method = "POST";
            state.existingQuestionNames = action.payload;
            state.question = {
                id: undefined,
                type: "qa",
                question: "",
                answer: "",
                multipleChoiceAnswer: undefined,
                a: undefined,
                b: undefined,
                c: undefined,
                d: undefined,
            };
            state.errors = {
                duplicateOpts: { a: false, b: false, c: false, d: false },
                duplicateQuestionName: false,
                emptyOpts: { a: false, b: false, c: false, d: false },
                emptyMcSelection: true,
                emptyQuestionInput: true,
                emptyAnswerInput: true,
            };
            state.justAdded = {
                a: false,
                b: false,
                c: false,
                d: false,
            };
            state.showErrorsModal = false;
        },

        editQuestion(
            state: State,
            action: PayloadAction<{
                question: State["question"];
                existingNames: State["existingQuestionNames"];
            }>,
        ) {
            const {
                payload: { question },
            } = action;

            state.method = "PUT";

            state.question = question;

            state.existingQuestionNames = action.payload.existingNames;
            state.questionInputReturnAction = "exit";
            state.answerInputReturnAction = "exit";
            state.errors = {
                ...state.errors,
                duplicateQuestionName: false,
                duplicateOpts: { a: false, b: false, c: false, d: false },
                emptyOpts: { a: false, b: false, c: false, d: false },
                emptyAnswerInput: false,
                emptyQuestionInput: false,
                emptyMcSelection: !!!question.multipleChoiceAnswer,
            };
            state.justAdded = {
                a: false,
                b: false,
                c: false,
                d: false,
            };
            state.showErrorsModal = false;
        },

        // Trash all work and return to Page
        cancelQuestion() {
            return initialState;
        },

        // Sets the type of the question which formats the view accordingly
        setQuestionType: (
            state: State,
            action: PayloadAction<State["question"]["type"]>,
        ) => {
            state.question.type = action.payload;
        },

        // Adds another input box to the modal for multiple choice options, but
        // caps at 4 options
        addMcInput: (state: State) => {
            const newOpt = { id: randomUUID(), value: "" };

            if (state.question.a === undefined) {
                state.question.a = newOpt;
                state.justAdded.a = true;
                return state;
            }
            if (state.question.b === undefined) {
                state.question.b = newOpt;
                state.justAdded.b = true;
                return state;
            }
            if (state.question.c === undefined) {
                state.question.c = newOpt;
                state.justAdded.c = true;
                return state;
            }
            if (state.question.d === undefined) {
                state.question.d = newOpt;
                state.justAdded.d = true;
                return state;
            }
        },

        // Updates the store state of the multiple choice option
        updateOptValue(
            state: State,
            action: PayloadAction<{
                optName: "a" | "b" | "c" | "d";
                value: string;
            }>,
        ) {
            const {
                payload: { optName, value },
            } = action;

            if (optName === "a" && state.question.a) state.question.a.value = value;
            if (optName === "b" && state.question.b) state.question.b.value = value;
            if (optName === "c" && state.question.c) state.question.c.value = value;
            if (optName === "d" && state.question.d) state.question.d.value = value;
        },

        // Deletes a multiple choice option.  Deleting an option cascades all other
        // options downward.  For example, if your only options are A and B, deleting
        // A replaces its value with B and deletes the B option.
        deleteOpt(state: State, action: PayloadAction<OptName>) {
            const { payload } = action;

            state.question[payload] = undefined;

            const filtered = [
                state.question.a,
                state.question.b,
                state.question.c,
                state.question.d,
            ].filter((opt) => opt !== undefined);

            ["a", "b", "c", "d"].forEach((opt, idx) => {
                state.question[opt] = filtered[idx];
            });

            // We just deleted a question, so reset the drop down
            // state.errors.emptyMcSelection = true;
            // state.question.multipleChoiceAnswer = undefined;

            if (!filtered.find((opt) => opt.id === state.question.multipleChoiceAnswer)) {
                state.errors.emptyMcSelection = true;
                state.question.multipleChoiceAnswer = undefined;
            }
        },

        // Updates the value from the selection drop down when the type is "mc"
        updateMultipleChoiceAnswer(
            state: State,
            action: PayloadAction<QuestionModel["multipleChoiceAnswer"]>,
        ) {
            state.question.multipleChoiceAnswer = action.payload;
            state.errors.emptyMcSelection = !!!action.payload;
        },

        updateQuestion(state: State, action: PayloadAction<string>) {
            state.question.question = action.payload;
        },

        updateAnswer(state: State, action: PayloadAction<string>) {
            state.question.answer = action.payload;
        },

        setQuestionInputReturnAction(
            state: State,
            action: PayloadAction<InputReturnAction>,
        ) {
            state.questionInputReturnAction = action.payload;
        },

        setAnswerInputReturnAction(
            state: State,
            action: PayloadAction<InputReturnAction>,
        ) {
            state.answerInputReturnAction = action.payload;
        },

        // Errors
        updateDuplicateQuestionName(state: State, action: PayloadAction<boolean>) {
            state.errors.duplicateQuestionName = action.payload;
        },
        updateDuplicateOpt(state: State, action: PayloadAction<OptErrorPayload>) {
            const {
                payload: { optName, hasError },
            } = action;

            if (optName === "a") state.errors.duplicateOpts.a = hasError;
            if (optName === "b") state.errors.duplicateOpts.b = hasError;
            if (optName === "c") state.errors.duplicateOpts.c = hasError;
            if (optName === "d") state.errors.duplicateOpts.d = hasError;
        },
        updateEmptyQuestionInput(state: State, action: PayloadAction<boolean>) {
            state.errors.emptyQuestionInput = action.payload;
        },
        updateEmptyAnswerInput(state: State, action: PayloadAction<boolean>) {
            state.errors.emptyAnswerInput = action.payload;
        },
        updateEmptyOptsInput(state: State, action: PayloadAction<OptErrorPayload>) {
            const {
                payload: { optName, hasError },
            } = action;

            if (optName === "a") state.errors.emptyOpts.a = hasError;
            if (optName === "b") state.errors.emptyOpts.b = hasError;
            if (optName === "c") state.errors.emptyOpts.c = hasError;
            if (optName === "d") state.errors.emptyOpts.d = hasError;
        },
        updateShowErrorsModal(state: State, action: PayloadAction<boolean>) {
            state.showErrorsModal = action.payload;
        },
    },
});

export default questionSlice.reducer;

export const Actions = questionSlice.actions;
export * as Thunks from "./thunks.js";
export * as Selectors from "./selectors.js";
