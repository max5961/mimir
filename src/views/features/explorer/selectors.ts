import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store.js";

export const CurrentColumn = createSelector(
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

export const ParentColumn = createSelector(
    [
        (state: RootState) => state.explorer.topicData.parentTopic,
        (state: RootState) => state.explorer.idxTrail,
    ],
    (parentTopic, idxTrail) => {
        return { parentTopic, idxTrail };
    },
);

export const NextColumn = createSelector(
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

export const TopBar = createSelector(
    [(state: RootState) => state.explorer.topicData.currentPath],
    (currentPath) => {
        return {
            currentPath,
        };
    },
);

export const CommandLine = createSelector(
    [
        (state: RootState) => state.explorer.topicData.currentTopic,
        (state: RootState) => state.explorer.currentIndex,
    ],
    (currentTopic, currentIndex) => {
        return { currentTopic, currentIndex };
    },
);

export const currentPath = createSelector(
    [(state: RootState) => state.explorer.topicData.currentPath],
    (currentPath) => {
        return { currentPath };
    },
);
