import { Logger } from "phileas";

const logger = new Logger();
logger.setFile("store.log");

export const storeLogger =
    ({ active }: { active: boolean }) =>
    (store: any) =>
    (next: any) =>
    (action: any) => {
        active && logger.write("DISPATCHING", action);
        const result = next(action);
        active && logger.write("NEXT STATE", store.getState());
        return result;
    };

export const formLogger =
    ({ active }: { active: boolean }) =>
    (store: any) =>
    (next: any) =>
    (action: any) => {
        active && logger.write("DISPATCHING", action);
        const result = next(action);
        active && logger.write("NEXT STATE", store.getState().form);
        return result;
    };
