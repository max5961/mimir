import { createAsyncThunk } from "@reduxjs/toolkit";
import { NewQuestion } from "./formSlice.js";
import name from "./sliceName.js";
import { QuestionModel } from "../../../models/QuestionModel.js";
import { QuestionResponse } from "../../../routes/questions/questionsController.js";
import { Path } from "../../../root.js";

export const postQuestion = createAsyncThunk(
    `${name}/postQuestion`,
    async (
        { topicID, question }: { topicID: string; question: NewQuestion },
        { rejectWithValue },
    ) => {
        try {
            const response = await fetch(
                `${Path.Api.Questions}/${topicID}/new-question`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newQuestion: question }),
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            const data = await response.json();

            return data as QuestionResponse.PostQuestion;
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
            const response = await fetch(
                `${Path.Api.Questions}/${topicID}/edit-question/${questionID}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question }),
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            const data = await response.json();

            return data as QuestionResponse.PutQuestion;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);
