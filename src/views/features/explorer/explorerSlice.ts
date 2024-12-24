import {
    createAsyncThunk,
    createSlice,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";
import { ExplorerState, NewTopic } from "./explorerTypes.js";
import Fetch from "./ExplorerFetch.js";
import { RootState } from "../../store/store.js";
import { Question, Topic } from "../../../models/TopicModel.js";

const name = "explorer";

const initialState: ExplorerState = {
    showPreview: true,
    parentTopicIndex: 0,
    previewTopic: null,
    previewQuestion: null,
    curr: { id: "", name: "", topics: [], questions: [] },
    parent: { id: "", name: "", topics: [], questions: [] },
    root: { id: "", name: "", topics: [], questions: [] },
    path: "",
};

const createTopicLoader = (type: string) => {
    return createAsyncThunk(
        `${name}/${type}`,
        async (id: string, { rejectWithValue }) => {
            try {
                return await Fetch.getTopic(id);
            } catch (err) {
                rejectWithValue(err);
            }
        },
    );
};

export const loadTopic = createTopicLoader("loadTopic");
export const loadNextTopic = createTopicLoader("loadNextTopic");
export const loadPrevTopic = createTopicLoader("loadPrevTopic");

export const postTopic = createAsyncThunk(
    `${name}/postTopic`,
    async (newTopic: NewTopic) => {
        //
    },
);

const explorerSlice = createSlice({
    name: name,
    initialState: initialState,
    reducers: {
        updateParentTopicIndex: (state: ExplorerState, action: PayloadAction<number>) => {
            state.parentTopicIndex = action.payload;
        },
        updatePreview: (
            state: ExplorerState,
            action: PayloadAction<{
                topicPreview: null | Topic;
                questionPreview: null | Question;
            }>,
        ) => {
            state.previewTopic = action.payload.topicPreview;
            state.previewQuestion = action.payload.questionPreview;
        },
        updateShowPreview: (state: ExplorerState, action: PayloadAction<boolean>) => {
            state.showPreview = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loadTopic.fulfilled, (state, { payload }) => {
                if (!payload) return;

                state.root = payload.root;
                state.curr = payload.curr;
                state.parent = payload.parent;
                state.path = payload.path;

                state.previewTopic = null;
                state.previewQuestion = null;
                if (payload.curr.topics.length) {
                    state.previewTopic = payload.curr.topics[0];
                } else if (payload.curr.questions.length) {
                    state.previewQuestion = payload.curr.questions[0];
                }
            })
            .addCase(loadNextTopic.fulfilled, (state, action) => {
                //
            })
            .addCase(loadPrevTopic.fulfilled, (state, action) => {
                //
            })
            .addCase(postTopic.fulfilled, (state) => {
                //
            });
    },
});

export const selectExplorer = createSelector(
    [
        (state: RootState) => state.explorer.path,
        (state: RootState) => state.explorer.previewTopic,
        (state: RootState) => state.explorer.showPreview,
    ],
    (path, previewTopic, showPreview) => {
        return {
            topicPath: path,
            topicPreview: previewTopic,
            showPreview: showPreview,
        };
    },
);

export const selectParentColumn = createSelector(
    [
        (state: RootState) => state.explorer.parent,
        (state: RootState) => state.explorer.curr,
    ],
    (parent, curr) => {
        return {
            parentTopic: parent,
            currTopic: curr,
        };
    },
);

export const selectCurrentColumn = createSelector(
    [
        (state: RootState) => state.explorer.parent,
        (state: RootState) => state.explorer.curr,
        (state: RootState) => state.explorer.parentTopicIndex,
    ],
    (parent, curr, parentTopicIndex) => {
        return {
            parent: parent,
            current: curr,
            parentTopicIndex: parentTopicIndex,
        };
    },
);

export const selectPreviewColumn = createSelector(
    [
        (state: RootState) => state.explorer.previewTopic,
        (state: RootState) => state.explorer.previewQuestion,
        (state: RootState) => state.explorer.showPreview,
    ],
    (topic, question, showPreview) => {
        return {
            topic,
            question,
            showPreview,
        };
    },
);

export const selectParentTopicIndex = (state: RootState) => {
    return state.explorer.parentTopicIndex;
};

export const selectRoot = (state: RootState) => {
    return state.explorer.root;
};

export const selectPath = (state: RootState) => {
    return state.explorer.path;
};

export const { updateParentTopicIndex, updatePreview, updateShowPreview } =
    explorerSlice.actions;
export default explorerSlice.reducer;
