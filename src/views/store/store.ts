import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import explorerSlice from "../features/explorer/explorerSlice.js";
import formSlice from "../features/form/formSlice.js";
import { storeLogger } from "../middleware/storeLogger.js";

const store = configureStore({
    reducer: {
        explorer: explorerSlice,
        form: formSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            // storeLogger({ active: NodeEnv === "development" }),
            storeLogger({ active: false }),
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
