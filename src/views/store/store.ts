import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { storeLogger } from "../middleware/storeLogger.js";
import explorerSlice from "../features/explorer/explorerSlice.js";
import formSlice from "../features/form/formSlice.js";
import cliSlice from "../features/cli/cliSlice.js";
import decksSlice from "../features/decks/decksSlice.js";
import quizSlice from "../features/quiz/quizSlice.js";

const store = configureStore({
    reducer: {
        explorer: explorerSlice,
        form: formSlice,
        cli: cliSlice,
        decks: decksSlice,
        quiz: quizSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            storeLogger({ active: true, slice: "quiz", logState: false }),
        );
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export default store;
