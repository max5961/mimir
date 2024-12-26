import {
    createAsyncThunk,
    createSlice,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";
import { ExplorerState } from "./explorerTypes.js";
import API from "./API.js";
import { RootState } from "../../store/store.js";
import { TopicResponse } from "../../../routes/topics/topicsController.js";

const name = "explorer";

const initialState: ExplorerState = {
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

type TopicDataPayload =
    | (TopicResponse.GetTopicData & { idxTrail?: number[] })
    | undefined;
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

const explorerSlice = createSlice({
    name: name,
    initialState: initialState,
    reducers: {
        updateNextColumn: (
            state: ExplorerState,
            action: PayloadAction<
                Pick<ExplorerState["nextColumn"], "nextQuestion" | "nextTopic">
            >,
        ) => {
            state.nextColumn.nextTopic = action.payload.nextTopic;
            state.nextColumn.nextQuestion = action.payload.nextQuestion;
        },
        updateIdxTrail: (state: ExplorerState, action: PayloadAction<number[]>) => {
            state.idxTrail = action.payload;
        },
        updateCurrentIndex: (state: ExplorerState, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(
                getTopicData.fulfilled,
                (state: ExplorerState, action: PayloadAction<TopicDataPayload>) => {
                    const { payload } = action;
                    if (!payload) return;

                    const { idxTrail, ...topicData } = payload;

                    state.topicData = topicData;
                },
            )
            .addCase(
                getNextTopicData.fulfilled,
                (state: ExplorerState, action: PayloadAction<TopicDataPayload>) => {
                    const { payload } = action;
                    if (!payload) return;

                    const { idxTrail, ...topicData } = payload;

                    state.topicData = topicData;
                    state.idxTrail = idxTrail ?? state.idxTrail;
                },
            )
            .addCase(
                getPrevTopicData.fulfilled,
                (state: ExplorerState, action: PayloadAction<TopicDataPayload>) => {
                    const { payload } = action;
                    if (!payload) return;

                    const { idxTrail, ...topicData } = payload;

                    state.topicData = topicData;
                    state.idxTrail = idxTrail ?? state.idxTrail;
                },
            )
            .addCase(
                postTopic.fulfilled,
                (
                    state: ExplorerState,
                    action: PayloadAction<TopicResponse.PostTopics | undefined>,
                ) => {
                    const { payload } = action;
                    if (!payload) return;

                    state.topicData = payload;
                },
            )
            .addCase(
                moveTopic.fulfilled,
                (
                    state: ExplorerState,
                    action: PayloadAction<TopicResponse.PostTopics | undefined>,
                ) => {
                    const { payload } = action;
                    if (!payload) return;

                    state.topicData = payload;
                },
            );
    },
});

export const selectCurrentColumn = createSelector(
    [
        (state: RootState) => state.explorer.topicData.currentTopic,
        (state: RootState) => state.explorer.topicData.currentPath,
        (state: RootState) => state.explorer.topicData.parentTopic?.id ?? null,
        (state: RootState) => state.explorer.idxTrail,
    ],
    (currentTopic, currentPath, parentID, idxTrail) => {
        return { currentTopic, currentPath, parentID, idxTrail };
    },
);

export const selectParentColumn = createSelector(
    [
        (state: RootState) => state.explorer.topicData.parentTopic,
        (state: RootState) => state.explorer.idxTrail,
    ],
    (parentTopic, idxTrail) => {
        return { parentTopic, idxTrail };
    },
);

export const selectNextColumn = createSelector(
    [
        (state: RootState) => state.explorer.nextColumn.nextTopic,
        (state: RootState) => state.explorer.nextColumn.nextQuestion,
        (state: RootState) => state.explorer.nextColumn.showNextColumn,
    ],
    (nextTopic, nextQuestion, showNextColumn) => {
        return {
            nextTopic,
            nextQuestion,
            showNextColumn,
        };
    },
);

export const selectTopBar = createSelector(
    [(state: RootState) => state.explorer.topicData.currentPath],
    (currentPath) => {
        return {
            currentPath,
        };
    },
);

export const selectCommandLine = createSelector(
    [
        (state: RootState) => state.explorer.topicData.currentTopic,
        (state: RootState) => state.explorer.currentIndex,
    ],
    (currentTopic, currentIndex) => {
        return { currentTopic, currentIndex };
    },
);

export const { updateNextColumn, updateIdxTrail, updateCurrentIndex } =
    explorerSlice.actions;
export default explorerSlice.reducer;
