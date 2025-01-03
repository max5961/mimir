import { createAsyncThunk } from "@reduxjs/toolkit";
import { NewQuestion } from "./formSlice.js";
import name from "./sliceName.js";
import { QuestionModel } from "../../../models/QuestionModel.js";
import API from "./API.js";

export const postQuestion = createAsyncThunk(
    `${name}/postQuestion`,
    async (
        { topicID, question }: { topicID: string; question: NewQuestion },
        { rejectWithValue },
    ) => {
        try {
            return await API.postQuestion(topicID, question);
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const putQuestion = createAsyncThunk(
    `${name}/putQuestion`,
    async (
        {
            topicID,
            question,
            questionID,
        }: { topicID: string; question: QuestionModel; questionID: string },
        { rejectWithValue },
    ) => {
        try {
            return await API.putQuestion({ topicID, question, questionID });
        } catch (err) {
            rejectWithValue(err);
        }
    },
);
