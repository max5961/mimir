import { createAsyncThunk } from "@reduxjs/toolkit";
import name from "./sliceName.js";
import API from "./API.js";

const generateTopicDataThunk = (type: string) => {
    return createAsyncThunk(
        `${name}/${type}`,
        async (
            { id, idxTrail }: { id: string; idxTrail?: number[] },
            { rejectWithValue },
        ) => {
            try {
                const data = await API.getTopicData(id);
                return { ...data, idxTrail };
            } catch (err) {
                rejectWithValue(err);
            }
        },
    );
};

export const getTopicData = generateTopicDataThunk("getTopicData");
export const getNextTopicData = generateTopicDataThunk("getNextTopicData");
export const getPrevTopicData = generateTopicDataThunk("getPrevTopicData");

export const postTopic = createAsyncThunk(
    `${name}/postTopic`,
    async (
        { names, currentTopicID }: { names: string[]; currentTopicID: string },
        { rejectWithValue },
    ) => {
        try {
            return await API.postTopics(currentTopicID, names);
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const moveTopic = createAsyncThunk(
    `${name}/moveTopic`,
    async (
        {
            cwdID,
            targetID,
            destination,
        }: { cwdID: string; targetID: string; destination: string },
        { rejectWithValue },
    ) => {
        try {
            return await API.moveTopic(cwdID, targetID, destination);
        } catch (err) {
            rejectWithValue(err);
        }
    },
);
