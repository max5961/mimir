import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewQuestion } from "./questionFormTypes.js";
import { RootState } from "../../store/store.js";

const name = "questionForm";

type State = {
    // Either a NewQuestion or a Question
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

const questionSlice = createSlice({
    name: name,
    initialState: initialState,
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

export const selectQuestion = createSelector(
    [
        (state: RootState) => state.questionForm.question.id,
        (state: RootState) => state.questionForm.question.type,
        (state: RootState) => state.questionForm.question.question,
        (state: RootState) => state.questionForm.question.answer,
        (state: RootState) => state.questionForm.question.A,
        (state: RootState) => state.questionForm.question.B,
        (state: RootState) => state.questionForm.question.C,
        (state: RootState) => state.questionForm.question.D,
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

export const selectInputAnswer = createSelector(
    [
        (state: RootState) => state.questionForm.question.type,
        (state: RootState) => state.questionForm.question.A,
        (state: RootState) => state.questionForm.question.B,
        (state: RootState) => state.questionForm.question.C,
        (state: RootState) => state.questionForm.question.D,
        (state: RootState) => state.questionForm.errors.invalidMcAnswer,
    ],
    (type, A, B, C, D, invalidMcAnswer) => {
        return { type, A, B, C, D, invalidMcAnswer };
    },
);

export const selectMcInput = createSelector(
    [
        (state: RootState) => state.questionForm.question.type,
        (state: RootState) => state.questionForm.question.A,
        (state: RootState) => state.questionForm.question.B,
        (state: RootState) => state.questionForm.question.C,
        (state: RootState) => state.questionForm.question.D,
        (state: RootState) => state.questionForm.errors.invalidMcInput.a,
        (state: RootState) => state.questionForm.errors.invalidMcInput.b,
        (state: RootState) => state.questionForm.errors.invalidMcInput.c,
        (state: RootState) => state.questionForm.errors.invalidMcInput.d,
    ],
    (type, A, B, C, D, aErr, bErr, cErr, dErr) => {
        return { type, A, B, C, D, aErr, bErr, cErr, dErr };
    },
);

export const {
    createNewQuestion,
    setQuestionType,
    pushMcQuestion,
    setInvalidMcAnswer,
    setInvalidMcInput,
    updateMcInput,
} = questionSlice.actions;
export default questionSlice.reducer;
