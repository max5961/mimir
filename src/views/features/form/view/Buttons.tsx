import React from "react";
import { Box, Text, useHideModal, useKeymap, useNode } from "tuir";
import { getDecorators } from "./decorators.js";
import { useNavigation } from "./useNavigation.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../formSlice.js";
import * as ExpSlice from "../../explorer/explorerSlice.js";

export function CancelButton(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { hideModal } = useHideModal();
    const node = useNode();
    useNavigation(node);

    const { title, boxStyles, color, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    const cancel = () => {
        dispatch(Slice.Actions.cancelQuestion());
        hideModal();
    };

    const { useEvent } = useKeymap({ cancel: { key: "return" } });
    useEvent("cancel", cancel);

    return (
        <Box
            height={3}
            styles={boxStyles}
            paddingX={10}
            titleTopRight={{ title, color }}
            onClick={cancel}
        >
            <Text styles={textStyles}>Cancel</Text>
        </Box>
    );
}

export function SubmitButton(): React.ReactNode {
    const dispatch = useAppDispatch();
    const form = useAppSelector(Slice.Selectors.All);
    const currentTopic = useAppSelector(ExpSlice.Selectors.currentTopic);
    const topicID = currentTopic.id;

    const node = useNode();
    useNavigation(node);

    const { hideModal } = useHideModal();

    const { title, boxStyles, color, textStyles } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    function handleSubmit() {
        if (
            form.question.type !== "mc" &&
            (form.errors.emptyQuestionInput ||
                form.errors.emptyAnswerInput ||
                form.errors.duplicateQuestionName)
        ) {
            dispatch(Slice.Actions.updateShowErrorsModal(true));
            return;
        }

        if (
            form.question.type === "mc" &&
            (form.errors.emptyOpts.a ||
                form.errors.emptyOpts.b ||
                form.errors.emptyOpts.c ||
                form.errors.emptyOpts.d ||
                form.errors.duplicateOpts.a ||
                form.errors.duplicateOpts.b ||
                form.errors.duplicateOpts.c ||
                form.errors.duplicateOpts.d ||
                form.errors.emptyQuestionInput ||
                form.errors.duplicateQuestionName ||
                form.errors.emptyMcSelection)
        ) {
            dispatch(Slice.Actions.updateShowErrorsModal(true));
            return;
        }

        // Hide the modal then send the fetch requests
        hideModal();

        if (form.method === "POST") {
            dispatch(
                Slice.Thunks.postQuestion({
                    topicID,
                    question: form.question,
                }),
            );
        }

        if (form.method === "PUT") {
            if (form.question.id) {
                dispatch(
                    Slice.Thunks.putQuestion({
                        topicID,
                        question: { ...form.question, id: form.question.id },
                        questionID: form.question.id,
                    }),
                );
            }
        }
    }

    const { useEvent } = useKeymap({ handleSubmit: { key: "return" } });
    useEvent("handleSubmit", handleSubmit);

    return (
        <Box
            height={3}
            styles={boxStyles}
            paddingX={10}
            titleTopRight={{ title: title, color: color }}
            onClick={handleSubmit}
        >
            <Text styles={textStyles}>Submit</Text>
        </Box>
    );
}
