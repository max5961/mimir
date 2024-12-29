import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import name from "./sliceName.js";
import { QuestionModel } from "../../../models/QuestionModel.js";

export type NewQuestion = Omit<QuestionModel, "id">;

type State = {
    question: NewQuestion & { id?: string };
    isValid: boolean;
    errors: {
        invalidMcAnswer: boolean;
        existQuestionName: boolean;
        invalidMcInput: {
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
        invalidMcAnswer: false,
        existQuestionName: false,
        invalidMcInput: { a: false, b: false, c: false, d: false },
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
        pushMcQuestion: (state: State) => {
            if (state.question.A === undefined) {
                state.question.A = "";
                return state;
            }
            if (state.question.B === undefined) {
                state.question.B = "";
                return state;
            }
            if (state.question.C === undefined) {
                state.question.C = "";
                return state;
            }
            if (state.question.D === undefined) {
                state.question.D = "";
                return state;
            }
        },
        setInvalidMcAnswer: (state: State, action: PayloadAction<boolean>) => {
            state.errors.invalidMcAnswer = action.payload;
        },
        setInvalidMcInput: (
            state: State,
            action: PayloadAction<{ mc: "a" | "b" | "c" | "d"; isErr: boolean }>,
        ) => {
            const { payload } = action;
            if (payload.mc === "a") {
                state.errors.invalidMcInput.a = payload.isErr;
            }
            if (payload.mc === "b") {
                state.errors.invalidMcInput.b = payload.isErr;
            }
            if (payload.mc === "c") {
                state.errors.invalidMcInput.c = payload.isErr;
            }
            if (payload.mc === "d") {
                state.errors.invalidMcInput.d = payload.isErr;
            }
        },
        updateMcInput: (
            state: State,
            action: PayloadAction<{ mc: "a" | "b" | "c" | "d"; value: string }>,
        ) => {
            const { payload } = action;
            if (payload.mc === "a") state.question.A = payload.value;
            if (payload.mc === "b") state.question.B = payload.value;
            if (payload.mc === "c") state.question.C = payload.value;
            if (payload.mc === "d") state.question.D = payload.value;
        },
    },
    extraReducers(builder) {
        //
    },
});

export default questionSlice.reducer;

export const Actions = questionSlice.actions;
export * as Selectors from "./selectors.js";
