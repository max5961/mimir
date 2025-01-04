import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sliceName } from "./sliceName.js";
import { CliMessage } from "tuir";

type State = {
    message?: CliMessage;
};

const initialState: State = {
    message: undefined,
} as const;

const cliSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setMessage(state: State, action: PayloadAction<CliMessage | undefined>) {
            state.message = action.payload;
        },
    },
    selectors: {
        selectMessage: (state) => {
            return { message: state.message };
        },
    },
});

export default cliSlice.reducer;
export const Selectors = cliSlice.selectors;
export const Actions = cliSlice.actions;
