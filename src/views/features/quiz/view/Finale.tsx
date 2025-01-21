import React from "react";
import { Box, List, Text, useKeymap, useList, useListItem } from "tuir";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../quizSlice.js";
import { Colors } from "../../../globals.js";

export function Finale({ goToStart }: { goToStart: () => void }): React.ReactNode {
    const { unanswered, incorrect } = useAppSelector(Slice.Selectors.statsArrays);
    const { onFocus } = useListItem();

    console.log({ unl: unanswered.length, inc: incorrect.length });

    const length =
        unanswered.length && incorrect.length
            ? 3
            : unanswered.length || incorrect.length
              ? 2
              : 1;

    const { listView, control } = useList(length);

    onFocus(() => {
        control.goToIndex(0);
    });

    return (
        <Box height="100" width="100" alignItems="flex-start" justifyContent="flex-start">
            {length === 3 ? (
                <List listView={listView}>
                    <Retake msg={"All"} goToStart={goToStart} />
                    <Retake msg={"Unanswered"} goToStart={goToStart} />
                    <Retake msg={"Incorrect"} goToStart={goToStart} />
                </List>
            ) : length === 2 ? (
                <List listView={listView}>
                    <Retake msg={"All"} goToStart={goToStart} />
                    <Retake
                        msg={unanswered.length ? "Unanswered" : "Incorrect"}
                        goToStart={goToStart}
                    />
                </List>
            ) : (
                <List listView={listView}>
                    <Retake msg={"All"} goToStart={goToStart} />
                </List>
            )}
        </Box>
    );
}

export function Retake({
    msg,
    goToStart,
}: {
    msg: "All" | "Unanswered" | "Incorrect";
    goToStart: () => void;
}): React.ReactNode {
    const dispatch = useAppDispatch();
    const { unanswered, incorrect, questions } = useAppSelector(
        Slice.Selectors.statsArrays,
    );
    const { isFocus } = useListItem();

    const { useEvent } = useKeymap({ choose: { key: "return" } });

    useEvent("choose", () => {
        const getNextArr = () => {
            if (msg === "All") return questions;
            if (msg === "Incorrect") return incorrect;
            if (msg === "Unanswered") return unanswered;
            throw new Error("Unhandled type");
        };

        dispatch(Slice.Actions.setQuestionsArray(getNextArr()));
        goToStart();
    });

    return (
        <Box
            height={3}
            width="100"
            flexShrink={0}
            borderStyle="round"
            borderColor={isFocus ? Colors.Secondary : Colors.ShallowFocus}
        >
            <Text>{`Retake ${msg}`}</Text>
        </Box>
    );
}
