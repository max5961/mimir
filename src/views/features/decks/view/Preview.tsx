import React from "react";
import { useAppSelector } from "../../../store/store.js";
import * as Slice from "../decksSlice.js";
import { PreviewColumn } from "../../explorer/view/NextColumn.js";

export function Preview(): React.ReactNode {
    const question = useAppSelector(Slice.Selectors.preview);

    return <PreviewColumn nextQuestion={question} nextTopic={null} />;
}
