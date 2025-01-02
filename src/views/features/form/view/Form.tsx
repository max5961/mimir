import {
    Box,
    KeyMap,
    Modal,
    Node,
    Styles,
    useKeymap,
    useModal,
    useNodeMap,
    useStdout,
} from "phileas";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { Colors } from "../../../globals.js";
import TypeView from "./ChooseFormat.js";
import MultipleChoice from "./MultipleChoice.js";
import { SubmitButton, CancelButton } from "./Buttons.js";
import { AnswerInput, QuestionInput } from "./Inputs.js";
import * as ExpSlice from "../../explorer/explorerSlice.js";
import * as Slice from "../formSlice.js";
import { MultipleChoiceDropDown } from "./MultipleChoiceDropDown.js";

const QuestionViewKeymap = {
    createNewQuestion: { input: "a" },
} as const satisfies KeyMap;

export default function Form(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { stdout } = useStdout();
    let { currentPath } = useAppSelector(ExpSlice.Selectors.currentPath);
    const { modal, showModal } = useModal({ show: null, hide: null });

    const { useEvent } = useKeymap(QuestionViewKeymap);

    useEvent("createNewQuestion", () => {
        showModal();
        dispatch(Slice.Actions.createNewQuestion());
    });

    const [hw, setHw] = useState({ h: stdout.rows, w: stdout.columns });

    const styles: Styles["Box"] = {
        height: "75",
        width: 125,
    };

    if (hw.h < 40) {
        styles.height = "100";
    }

    if (hw.w <= 125) {
        styles.width = "100";
    }

    useEffect(() => {
        const handler = () => setHw({ h: stdout.rows, w: stdout.columns });
        stdout.on("resize", handler);
        return () => {
            stdout.off("resize", handler);
        };
    }, [stdout]);

    return (
        <Modal
            modal={modal}
            styles={styles}
            borderStyle="round"
            borderColor={Colors.Alt}
            paddingX={1}
            titleTopCenter={{
                title: `New Question───${currentPath}`,
                color: Colors.Alt,
            }}
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
    // prettier-ignore
    const { type, opts } = useAppSelector(Slice.Selectors.Form);

    const map = [[...nodeMap[0]], [...nodeMap[1]]];
    if (type === "mc") {
        let length = 0;
        opts.a !== undefined && map.push(["a"]) && ++length;
        opts.b !== undefined && map.push(["b"]) && ++length;
        opts.c !== undefined && map.push(["c"]) && ++length;
        opts.d !== undefined && map.push(["d"]) && ++length;
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
            justifyContent="flex-start"
        >
            <Node {...register("type")}>
                <TypeView />
            </Node>
            <Box height="50" width="100" flexDirection="row" gap={2}>
                <Node {...register("question")}>
                    <QuestionInput />
                </Node>
                <Node {...register("answer")}>
                    {type === "mc" ? <MultipleChoiceDropDown /> : <AnswerInput />}
                </Node>
            </Box>
            <MultipleChoice register={register} />
            <Box width="100">
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
