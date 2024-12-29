import { Box, KeyMap, Modal, Node, useKeymap, useModal, useNodeMap } from "phileas";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { createNewQuestion, selectQuestion } from "../questionFormSlice.js";
import { Colors } from "../../../globals.js";
import TypeView from "./TypeView.js";
import { InputAnswer, InputQuestion } from "./Inputs.js";
import MultipleChoice from "./MultipleChoice.js";
import { SubmitButton, CancelButton } from "./Buttons.js";

const QuestionViewKeymap = {
    createNewQuestion: { input: "a" },
} as const satisfies KeyMap;

export default function QuestionView(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { modal, showModal } = useModal({ show: null, hide: null });

    const { useEvent } = useKeymap(QuestionViewKeymap);

    useEvent("createNewQuestion", () => {
        showModal();
        dispatch(createNewQuestion());
    });

    return (
        <Modal
            modal={modal}
            height="75"
            width={125}
            borderStyle="round"
            borderColor={Colors.Alt}
            paddingX={1}
            titleTopCenter={{ title: "New Question", color: Colors.Alt }}
        >
            <ModalContent />
        </Modal>
    );
}

// prettier-ignore
export type NodeNames = 
    "type" | "question" | "answer" | "a" | "b" | "c" | "d" | "add-mc" | "submit" | "cancel";

// prettier-ignore
export const nodeMap: NodeNames[][] = [
    ["type"], 
    ["question", "answer"]
];

function ModalContent(): React.ReactNode {
    const { type, A, B, C, D } = useAppSelector(selectQuestion);

    const map = [[...nodeMap[0]], [...nodeMap[1]]];
    if (type === "mc") {
        let length = 0;
        A !== undefined && map.push(["a"]) && ++length;
        B !== undefined && map.push(["b"]) && ++length;
        C !== undefined && map.push(["c"]) && ++length;
        D !== undefined && map.push(["d"]) && ++length;
        length < 4 && map.push(["add-mc"]);
    }
    map.push(["submit", "cancel"]);

    const { register } = useNodeMap<NodeNames>(map, { navigation: "none" });

    return (
        <Box
            height="100"
            width="100"
            flexDirection="column"
            gap={1}
            padding={1}
            justifyContent="space-between"
        >
            <Node {...register("type")}>
                <TypeView />
            </Node>
            <Box height="100" width="100" flexDirection="row" gap={2}>
                <Node {...register("question")}>
                    <InputQuestion />
                </Node>
                <Node {...register("answer")}>
                    <InputAnswer />
                </Node>
            </Box>
            <MultipleChoice register={register} />
            <Box width="100" height="100" alignItems="flex-end">
                <Node {...register("submit")}>
                    <SubmitButton />
                </Node>
                <Node {...register("cancel")}>
                    <CancelButton />
                </Node>
            </Box>
        </Box>
    );
}
