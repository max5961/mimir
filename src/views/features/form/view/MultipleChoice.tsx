import React, { useEffect } from "react";
import {
    Box,
    Node,
    Text,
    TextInput,
    useKeymap,
    useNode,
    useNodeMap,
    useTextInput,
} from "phileas";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { NodeNames } from "./FormModal.js";
import { getDecorators } from "./decorators.js";
import { useNavigation } from "./useNavigation.js";
import * as Slice from "../formSlice.js";

type Props = {
    register: ReturnType<typeof useNodeMap<NodeNames>>["register"];
};

export default function MultipleChoice({ register }: Props): React.ReactNode {
    const { type, A, B, C, D } = useAppSelector(Slice.Selectors.QuestionInput);

    const renderAddBtn =
        A === undefined || B === undefined || C === undefined || D === undefined;

    return (
        <Box
            display={type === "mc" ? "flex" : "none"}
            flexDirection="column"
            flexShrink={0}
        >
            <Node {...register("a")}>
                <MCAnswer question={A} />
            </Node>
            <Node {...register("b")}>
                <MCAnswer question={B} />
            </Node>
            <Node {...register("c")}>
                <MCAnswer question={C} />
            </Node>
            <Node {...register("d")}>
                <MCAnswer question={D} />
            </Node>
            {renderAddBtn && (
                <Node {...register("add-mc")}>
                    <AddButton />
                </Node>
            )}
        </Box>
    );
}

export function AddButton(): React.ReactNode {
    const dispatch = useAppDispatch();
    const node = useNode();
    useNavigation(node);

    const { useEvent } = useKeymap({ pushMcQuestion: { key: "return" } });
    useEvent("pushMcQuestion", () => {
        dispatch(Slice.Actions.pushMcQuestion());
    });

    const { boxStyles, textStyles, color, title } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    return (
        <Box
            height={3}
            width="100"
            flexShrink={0}
            styles={boxStyles}
            titleTopRight={{ title: title, color: color }}
            justifyContent="center"
        >
            <Text styles={textStyles}>{"Add + "}</Text>
        </Box>
    );
}

export function MCAnswer({ question }: { question?: string }): React.ReactNode {
    const dispatch = useAppDispatch();
    const { type, A, B, C, D, aErr, bErr, cErr, dErr } = useAppSelector(
        Slice.Selectors.McInput,
    );
    const node = useNode();

    const { onChange, setValue, value, enterInsert, insert } = useTextInput(
        question ?? "",
    );
    useNavigation(node);

    useEffect(() => {
        setValue(question ?? "");
    }, [question]);

    useEffect(() => {
        const mc = node.name as "a" | "b" | "c" | "d";

        let isErr = false;
        if (value === "") {
            isErr = true;
        } else {
            const exists = [A, B, C, D]
                .filter(
                    (_, idx) => node.name.toUpperCase() !== String.fromCharCode(idx + 65),
                )
                .filter((opt) => opt !== undefined)
                .find((opt) => opt === value);
            isErr = !!exists;
        }

        dispatch(Slice.Actions.setInvalidMcInput({ mc, isErr }));
    }, [type, value]);

    let hasErrors = false;
    if (node.name === "a" && aErr) hasErrors = true;
    if (node.name === "b" && bErr) hasErrors = true;
    if (node.name === "c" && cErr) hasErrors = true;
    if (node.name === "d" && dErr) hasErrors = true;

    const isDisplay = question !== undefined;
    useEffect(() => {
        if (isDisplay) {
            enterInsert();
        }
    }, [isDisplay]);

    const { title, boxStyles, textStyles, color } = getDecorators(node, {
        hasErrors,
        insert,
        type: "line",
    });

    return (
        <Box
            display={question === undefined ? "none" : "flex"}
            height={3}
            flexShrink={0}
            width="100"
            styles={boxStyles}
            titleTopRight={{ title, color }}
        >
            <Text>{`${node.name.toUpperCase()}: `}</Text>
            <TextInput
                textStyle={textStyles}
                onChange={onChange}
                onExit={(value: string) => {
                    const mc = node.name as "a" | "b" | "c" | "d";
                    dispatch(Slice.Actions.updateMcInput({ mc, value }));
                }}
            />
        </Box>
    );
}
