import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import fetch from "node-fetch";
import { name } from "./sliceName.js";
import { Path } from "../../../root.js";
import { ActiveDeck, QuizQuestion } from "../../../models/DeckModel.js";
import { shuffle } from "./shuffle.js";

export const getActiveDeck = createAsyncThunk(
    `${name}/getActiveDeck`,
    async (_: undefined, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.ActiveDeck}/active`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);

export const shuffleActiveDeck = createAsyncThunk(
    `${name}/shuffleActiveDeck`,
    async (currentActiveDeck: ActiveDeck, { rejectWithValue }) => {
        try {
            const shuffledDeck = shuffle(currentActiveDeck);

            const response = await fetch(`${Path.Api.ActiveDeck}/active`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activeDeck: shuffledDeck }),
            });

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as ActiveDeck;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const pushQuestionToActiveDeck = createAsyncThunk(
    `${name}/pushQuestionToActiveDeck`,
    async (question: QuizQuestion, { rejectWithValue }) => {
        try {
            const response = await fetch(`${Path.Api.ActiveDeck}/active`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as ActiveDeck;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

// .post("/active/topic/:id", asyncHandler(Controller.postTopicToActiveDeck));
export const pushTopicToActiveDeck = createAsyncThunk(
    `${name}/pushTopicToActiveDeck`,
    async (topicID: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${Path.Api.ActiveDeck}/active/topic/${topicID}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as ActiveDeck;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const deleteQuestionFromActiveDeck = createAsyncThunk(
    `${name}/deleteQuestionFromActiveDeck`,
    async (questionID: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${Path.Api.ActiveDeck}/active/question/${questionID}`,
                {
                    method: "DELETE",
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as ActiveDeck;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const clearActiveDeck = createAsyncThunk(
    `${name}/clearActiveDeck`,
    async (_, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.ActiveDeck}/active/clear`, {
            method: "DELETE",
        });

        if (!response.ok) {
            rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);
