import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store/store.js";

export const currentTopic = (state: RootState) => state.explorer.topicData.currentTopic;
export const currentPath = (state: RootState) => state.explorer.topicData.currentPath;
export const parentTopic = (state: RootState) => state.explorer.topicData.parentTopic;
export const parentID = (state: RootState) =>
    state.explorer.topicData.parentTopic?.id ?? null;
export const idxTrail = (state: RootState) => state.explorer.idxTrail;
export const nextTopic = (state: RootState) => state.explorer.nextColumn.nextTopic;
export const nextQuestion = (state: RootState) => state.explorer.nextColumn.nextQuestion;
export const showNextColumn = (state: RootState) =>
    state.explorer.nextColumn.showNextColumn;
export const currentIndex = (state: RootState) => state.explorer.currentIndex;

export const CurrentColumn = createSelector(
    [currentTopic, currentPath, parentID, idxTrail],
    (currentTopic, currentPath, parentID, idxTrail) => {
        return { currentTopic, currentPath, parentID, idxTrail };
    },
);

export const ParentColumn = createSelector(
    [parentTopic, idxTrail],
    (parentTopic, idxTrail) => {
        return { parentTopic, idxTrail };
    },
);

export const NextColumn = createSelector(
    [nextTopic, nextQuestion, showNextColumn],
    (nextTopic, nextQuestion, showNextColumn) => {
        return {
            nextTopic,
            nextQuestion,
            showNextColumn,
        };
    },
);

export const TopBar = createSelector([currentPath], (currentPath) => {
    return {
        currentPath,
    };
});

export const CommandLine = createSelector(
    [currentTopic, currentIndex, nextTopic, nextQuestion],
    (currentTopic, currentIndex, nextTopic, nextQuestion) => {
        return { currentTopic, currentIndex, nextTopic, nextQuestion };
    },
);

export const NewForm = createSelector(
    [currentTopic, currentPath, nextQuestion],
    (currentTopic, currentPath, nextQuestion) => {
        const existingNames = currentTopic.questions.map((question) => question.question);

        return {
            currentTopic,
            nextQuestion,
            existingNames,
            currentPath,
        };
    },
);
