import { Logger } from "tuir";

const logger = new Logger();
logger.setFile("store.log");

export const storeLogger =
    ({
        active,
        slice = "all",
        logState = true,
    }: {
        active: boolean;
        slice: "all" | "explorer" | "form" | "deck" | "cli" | "quiz";
        logState: boolean;
    }) =>
    (store: any) =>
    (next: any) =>
    (action: any) => {
        active && logger.write("DISPATCHING", action);
        const result = next(action);

        let nextState: any = store.getState();
        if (slice === "deck") {
            nextState = store.getState().decks;
        }
        if (slice === "form") {
            nextState = store.getState().form;
        }
        if (slice === "explorer") {
            nextState = store.getState().explorer;
        }
        if (slice === "cli") {
            nextState = store.getState().cli;
        }

        active && logState && logger.write("NEXT STATE", nextState);
        return result;
    };
