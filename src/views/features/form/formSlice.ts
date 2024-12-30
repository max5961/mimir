import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import name from "./sliceName.js";
import { QuestionModel } from "../../../models/QuestionModel.js";
import { randomUUID } from "crypto";

export type NewQuestion = Omit<QuestionModel, "id">;
export type MCAnswer = QuestionModel["multipleChoiceAnswer"];

export type OptName = "a" | "b" | "c" | "d";

type State = {
    question: NewQuestion & { id?: string };
    isValid: boolean;
    errors: {
        existQuestionName: boolean;
        multipleChoiceDropDown: boolean;
        opts: {
            a: boolean;
            b: boolean;
            c: boolean;
            d: boolean;
        };
    };
};

const initialState: State = {
    question: { id: "", type: "qa", question: "", answer: "" },
    isValid: false,
    errors: {
        existQuestionName: false,
        multipleChoiceDropDown: true, // initializes to 'select', so its always in an error state at first
        opts: { a: false, b: false, c: false, d: false },
    },
};

export const sliceName = "questionForm";

const questionSlice = createSlice({
    name,
    initialState,
    reducers: {
        createNewQuestion: (state: State) => {
            state.question = initialState.question;
            state.isValid = false;
        },
        setQuestionType: (
            state: State,
            action: PayloadAction<State["question"]["type"]>,
        ) => {
            state.question.type = action.payload;
        },
        addMultipleChoiceInput: (state: State) => {
            const newOpt = { id: randomUUID(), value: "" };

            if (state.question.a === undefined) {
                state.question.a = newOpt;
                return state;
            }
            if (state.question.b === undefined) {
                state.question.b = newOpt;
                return state;
            }
            if (state.question.c === undefined) {
                state.question.c = newOpt;
                return state;
            }
            if (state.question.d === undefined) {
                state.question.d = newOpt;
                return state;
            }
        },
        updateMultipleChoiceErrors(
            state: State,
            action: PayloadAction<{ optName: OptName; hasError: boolean }>,
        ) {
            const {
                payload: { optName, hasError },
            } = action;

            if (optName === "a") state.errors.opts.a = hasError;
            if (optName === "b") state.errors.opts.b = hasError;
            if (optName === "c") state.errors.opts.c = hasError;
            if (optName === "d") state.errors.opts.d = hasError;
        },
        updateMultipleChoiceValue(
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
        deleteMultipleChoiceOpt(state: State, action: PayloadAction<OptName>) {
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

            // We just deleted a quesiton, so reset the drop down
            state.errors.multipleChoiceDropDown = true;
            state.question.multipleChoiceAnswer = undefined;
        },
        updateMultipleChoiceAnswer(
            state: State,
            action: PayloadAction<QuestionModel["multipleChoiceAnswer"]>,
        ) {
            state.question.multipleChoiceAnswer = action.payload;
            state.errors.multipleChoiceDropDown = !!!action.payload;
        },
    },
    extraReducers(builder) {
        //
    },
});

export default questionSlice.reducer;

export const Actions = questionSlice.actions;
export * as Selectors from "./selectors.js";
