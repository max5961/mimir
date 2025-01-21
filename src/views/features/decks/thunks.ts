import { createAsyncThunk } from "@reduxjs/toolkit";
import fetch from "node-fetch";
import { name } from "./sliceName.js";
import { Path } from "../../../root.js";
import { ActiveDeck, QuizQuestion, SavedDeckStore } from "../../../models/DeckModel.js";
import { shuffle } from "./shuffle.js";

export const getActiveDeck = createAsyncThunk(
    `${name}/getActiveDeck`,
    async (_: undefined, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/active`, {
            method: "GET",
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
        const shuffledDeck = shuffle(currentActiveDeck);

        const response = await fetch(`${Path.Api.Decks}/active`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activeDeck: shuffledDeck }),
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);

export const pushQuestionToActiveDeck = createAsyncThunk(
    `${name}/pushQuestionToActiveDeck`,
    async (question: QuizQuestion, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/active`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);

export const pushTopicToActiveDeck = createAsyncThunk(
    `${name}/pushTopicToActiveDeck`,
    async (topicID: string, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/active/topic/${topicID}`, {
            method: "POST",
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);

export const deleteQuestionFromActiveDeck = createAsyncThunk(
    `${name}/deleteQuestionFromActiveDeck`,
    async (questionID: string, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/active/question/${questionID}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);

export const clearActiveDeck = createAsyncThunk(
    `${name}/clearActiveDeck`,
    async (_, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/active/clear`, {
            method: "DELETE",
        });

        if (!response.ok) {
            rejectWithValue(response.status);
        }

        return (await response.json()) as ActiveDeck;
    },
);

export const getSavedDecks = createAsyncThunk(
    `${name}/getSavedDecks`,
    async (_, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/saved`, { method: "GET" });

        if (!response.ok) {
            rejectWithValue(response.status);
        }

        return (await response.json()) as SavedDeckStore;
    },
);

export const saveActiveDeckAs = createAsyncThunk(
    `${name}/saveActiveDeck`,
    async (
        { name, activeDeck }: { name: string; activeDeck: ActiveDeck },
        { rejectWithValue },
    ) => {
        const response = await fetch(`${Path.Api.Decks}/saved/${name}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activeDeck }),
        });

        if (!response.ok) {
            rejectWithValue(response.status);
        }

        return (await response.json()) as SavedDeckStore;
    },
);

export const deleteSavedDeck = createAsyncThunk(
    `${name}/deleteSavedDeck`,
    async (id: string, { rejectWithValue }) => {
        const response = await fetch(`${Path.Api.Decks}/saved/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as SavedDeckStore;
    },
);

export const postActiveToSaved = createAsyncThunk(
    `${name}/postActiveToSaved`,
    async (
        { activeDeck, targetID }: { activeDeck: ActiveDeck; targetID: string },
        { rejectWithValue },
    ) => {
        const response = await fetch(`${Path.Api.Decks}/saved/from-active/${targetID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activeDeck }),
        });

        if (!response.ok) {
            return rejectWithValue(response.status);
        }

        return (await response.json()) as SavedDeckStore;
    },
);
