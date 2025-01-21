import React from "react";
import { useAppSelector } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { PreviewColumn } from "../../explorer/view/NextColumn.js";
import { List, Text, useList } from "tuir";

export function Preview(): React.ReactNode {
    const question = useAppSelector(Slice.Selectors.preview);

    return <PreviewColumn nextQuestion={question} nextTopic={null} />;
}

export function PreviewCurrentSaved(): React.ReactNode {
    const { questions } = useAppSelector(Slice.Selectors.previewSaved);

    const { listView } = useList(questions?.length ?? 0, { navigation: "none" });

    if (!questions) return null;

    return (
        <List listView={listView}>
            {questions.map((question, idx) => {
                return <Text key={idx}>{question}</Text>;
            })}
        </List>
    );
}
