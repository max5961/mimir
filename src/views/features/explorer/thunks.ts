import { createAsyncThunk } from "@reduxjs/toolkit";
import name from "./sliceName.js";
import { TopicResponse } from "../../../routes/topics/topicsController.js";
import { Path } from "../../../root.js";

const generateTopicDataThunk = (type: string) => {
    return createAsyncThunk(
        `${name}/${type}`,
        async (
            { topicID, idxTrail }: { topicID: string; idxTrail?: number[] },
            { rejectWithValue },
        ) => {
            try {
                const response = await fetch(`${Path.Api.Topics}/data/${topicID}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    return Promise.reject(response.status);
                }

                const data = (await response.json()) as TopicResponse.GetTopicData;

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
        { newTopicNames, topicID }: { newTopicNames: string[]; topicID: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await fetch(`${Path.Api.Topics}/${topicID}/subtopics`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newTopicNames }),
            });

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as TopicResponse.PostTopics;
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
            subTopicID,
            destination,
        }: { cwdID: string; subTopicID: string; destination: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await fetch(
                `${Path.Api.Topics}/move/${cwdID}/${subTopicID}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ destination }),
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as TopicResponse.MoveTopic;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);
