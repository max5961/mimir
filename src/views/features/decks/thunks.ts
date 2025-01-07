import { createAsyncThunk } from "@reduxjs/toolkit";
import fetch from "node-fetch";
import { name } from "./sliceName.js";
import { Path } from "../../../root.js";
import { ActiveDeck } from "../../../models/DeckModel.js";
import { shuffle } from "./shuffle.js";

export const getActiveDeck = createAsyncThunk(
    `${name}/getActiveDeck`,
    async (_: undefined, { rejectWithValue }) => {
        try {
            const response = await fetch(`${Path.Api.Decks}/active`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
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

export const shuffleActiveDeck = createAsyncThunk(
    `${name}/shuffleActiveDeck`,
    async (currentActiveDeck: ActiveDeck, { rejectWithValue }) => {
        try {
            const shuffledDeck = shuffle(currentActiveDeck);

            const response = await fetch(`${Path.Api.Decks}/active`, {
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
