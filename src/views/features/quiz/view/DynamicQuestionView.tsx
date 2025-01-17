import React from "react";
import { useKeymap, useListItem } from "tuir";
import { useAppDispatch } from "../../../store/store.js";
import { MultipleChoice } from "./MultipleChoice.js";
import { QuestionAnswer } from "./QuestionAnswer.js";
import { QuestionInput } from "./QuestionInput.js";
import * as Slice from "../quizSlice.js";

export type DynamicQuestionProps = {
    question: Slice.Question;
};

export function DynamicQuestionView({ question }: DynamicQuestionProps): React.ReactNode {
    const dispatch = useAppDispatch();
    const { itemIndex } = useListItem();

    const { useEvent } = useKeymap({
        markCorrect: { input: " " },
        markIncorrect: { input: "x" },
    });

    useEvent("markCorrect", () => {
        dispatch(Slice.Actions.setQuestion({ idx: itemIndex, status: "correct" }));
    });

    useEvent("markIncorrect", () => {
        dispatch(Slice.Actions.setQuestion({ idx: itemIndex, status: "incorrect" }));
    });

    if (question.type === "mc") {
        return <MultipleChoice question={question} />;
    }

    if (question.type === "qa") {
        return <QuestionAnswer question={question} />;
    }

    if (question.type === "qi") {
        return <QuestionInput question={question} />;
    }

    return null;
}
