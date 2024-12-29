import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TopicResponse } from "../../../routes/topics/topicsController.js";
import { TopicModel } from "../../../models/TopicModel.js";
import { QuestionModel } from "../../../models/QuestionModel.js";
import name from "./sliceName.js";
import * as Thunks from "./thunks.js";

export type State = {
    idxTrail: number[];
    currentIndex: number;
    topicData: TopicResponse.GetTopicData;
    nextColumn: {
        nextTopic: TopicModel | null;
        nextQuestion: QuestionModel | null;
        showNextColumn: boolean;
    };
};

type TopicDataPayload =
    | (TopicResponse.GetTopicData & { idxTrail?: number[] })
    | undefined;

const initialState: State = {
    idxTrail: [],
    currentIndex: 0,
    topicData: {
        currentPath: "",
        currentTopic: { id: "", name: "", subTopics: [], questions: [] },
        parentTopic: null,
    },
    nextColumn: {
        nextTopic: null,
        nextQuestion: null,
        showNextColumn: true,
    },
};

const explorerSlice = createSlice({
    name,
    initialState,
    reducers: {
        updateNextColumn: (
            state: State,
            action: PayloadAction<
                Pick<State["nextColumn"], "nextQuestion" | "nextTopic">
            >,
        ) => {
            state.nextColumn.nextTopic = action.payload.nextTopic;
            state.nextColumn.nextQuestion = action.payload.nextQuestion;
        },
        updateIdxTrail: (state: State, action: PayloadAction<number[]>) => {
            state.idxTrail = action.payload;
        },
        updateCurrentIndex: (state: State, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(
                Thunks.getTopicData.fulfilled,
                (state: State, action: PayloadAction<TopicDataPayload>) => {
                    const { payload } = action;
                    if (!payload) return;

                    const { idxTrail, ...topicData } = payload;

                    state.topicData = topicData;
                },
            )
            .addCase(
                Thunks.getNextTopicData.fulfilled,
                (state: State, action: PayloadAction<TopicDataPayload>) => {
                    const { payload } = action;
                    if (!payload) return;

                    const { idxTrail, ...topicData } = payload;

                    state.topicData = topicData;
                    state.idxTrail = idxTrail ?? state.idxTrail;
                },
            )
            .addCase(
                Thunks.getPrevTopicData.fulfilled,
                (state: State, action: PayloadAction<TopicDataPayload>) => {
                    const { payload } = action;
                    if (!payload) return;

                    const { idxTrail, ...topicData } = payload;

                    state.topicData = topicData;
                    state.idxTrail = idxTrail ?? state.idxTrail;
                },
            )
            .addCase(
                Thunks.postTopic.fulfilled,
                (
                    state: State,
                    action: PayloadAction<TopicResponse.PostTopics | undefined>,
                ) => {
                    const { payload } = action;
                    if (!payload) return;

                    state.topicData = payload;
                },
            )
            .addCase(
                Thunks.moveTopic.fulfilled,
                (
                    state: State,
                    action: PayloadAction<TopicResponse.PostTopics | undefined>,
                ) => {
                    const { payload } = action;
                    if (!payload) return;

                    state.topicData = payload;
                },
            );
    },
});

export default explorerSlice.reducer;

export * as Selectors from "./selectors.js";
export const Actions = { ...explorerSlice.actions, ...Thunks };
