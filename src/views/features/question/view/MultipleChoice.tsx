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
import {
    pushMcQuestion,
    selectMcInput,
    selectQuestion,
    setInvalidMcInput,
    updateMcInput,
} from "../questionFormSlice.js";
import { QStyles } from "./style.js";
import { NodeNames } from "./QuestionView.js";
import useNavigation from "./useNavigation.js";
import { Colors } from "../../../globals.js";

type Props = {
    register: ReturnType<typeof useNodeMap<NodeNames>>["register"];
};

export default function MultipleChoice({ register }: Props): React.ReactNode {
    const { type, A, B, C, D } = useAppSelector(selectQuestion);

    const renderAddBtn =
        A === undefined || B === undefined || C === undefined || D === undefined;

    return (
        <Box
            height="100"
            width="100"
            display={type === "mc" ? "flex" : "none"}
            flexDirection="column"
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
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;
    useNavigation(node);

    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;
    const color = boxStyles.borderColor;

    const { useEvent } = useKeymap({ pushMcQuestion: { key: "return" } });
    useEvent("pushMcQuestion", () => {
        dispatch(pushMcQuestion());
    });

    const titleTopRight = node.isFocus ? "Return to add" : `[${nodeIndex}]`;

    return (
        <Box
            height={3}
            width="100"
            flexShrink={0}
            styles={boxStyles}
            titleTopRight={{ title: titleTopRight, color: color }}
            justifyContent="center"
        >
            <Text color={color}>{"Add + "}</Text>
        </Box>
    );
}

export function MCAnswer({ question }: { question?: string }): React.ReactNode {
    const dispatch = useAppDispatch();
    const { type, A, B, C, D, aErr, bErr, cErr, dErr } = useAppSelector(selectMcInput);
    const node = useNode();
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;

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

        dispatch(setInvalidMcInput({ mc, isErr }));
    }, [type, value]);

    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;
    const color = boxStyles.borderColor;

    let isErr = false;
    if (node.name === "a" && aErr) isErr = true;
    if (node.name === "b" && bErr) isErr = true;
    if (node.name === "c" && cErr) isErr = true;
    if (node.name === "d" && dErr) isErr = true;

    const isDisplay = question !== undefined;
    useEffect(() => {
        if (isDisplay) {
            enterInsert();
        }
    }, [isDisplay]);

    const titleTopRight = insert
        ? "Return/Esc to stop"
        : node.isFocus
          ? "Return/i to edit"
          : `[${nodeIndex}]`;

    return (
        <Box
            display={question === undefined ? "none" : "flex"}
            height={3}
            flexShrink={0}
            width="100"
            styles={boxStyles}
            borderColor={isErr ? Colors.Error : undefined}
            titleTopRight={{ title: titleTopRight, color: color }}
        >
            <Text>{`${node.name.toUpperCase()}: `}</Text>
            <TextInput
                textStyle={{ color }}
                onChange={onChange}
                onExit={(value: string) => {
                    const mc = node.name as "a" | "b" | "c" | "d";
                    dispatch(updateMcInput({ mc, value }));
                }}
            />
        </Box>
    );
}
