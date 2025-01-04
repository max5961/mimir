import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import name from "./sliceName.js";
import { TopicResponse } from "../../../routes/topics/topicsController.js";
import { Path } from "../../../root.js";
import { QuestionResponse } from "../../../routes/questions/questionsController.js";

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

export const deleteQuestion = createAsyncThunk(
    `${name}/deleteQuestion`,
    async (
        { topicID, questionID }: { topicID: string; questionID: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await fetch(
                `${Path.Api.Questions}/${topicID}/${questionID}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as QuestionResponse.DeleteQuestion;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const deleteTopic = createAsyncThunk(
    `${name}/deleteTopic`,
    async (
        { topicID, subTopicID }: { topicID: string; subTopicID: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await fetch(
                `${Path.Api.Topics}/subTopic/${topicID}/${subTopicID}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as TopicResponse.DeleteTopic;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);

export const deleteMany = createAsyncThunk(
    `${name}/deleteMany`,
    async (
        { topicID, names, force }: { topicID: string; names: string[]; force: boolean },
        { rejectWithValue },
    ) => {
        try {
            const response = await fetch(`${Path.Api.Topics}/many/${topicID}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ names, force }),
            });

            if (!response.ok) {
                return Promise.reject(response.status);
            }

            return (await response.json()) as TopicResponse.DeleteMany;
        } catch (err) {
            rejectWithValue(err);
        }
    },
);
