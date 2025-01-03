import React, { useEffect } from "react";
import {
    Box,
    logger,
    Node,
    Text,
    TextInput,
    useKeymap,
    useNode,
    useNodeMap,
    useTextInput,
} from "tuir";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { NodeNames } from "./Form.js";
import { getDecorators } from "./decorators.js";
import { goToClickedNode, useNavigation } from "./useNavigation.js";
import * as Slice from "../formSlice.js";
import { emptyOpts } from "../selectors.js";

type Props = {
    register: ReturnType<typeof useNodeMap<NodeNames>>["register"];
};

export default function MultipleChoice({ register }: Props): React.ReactNode {
    const { questionType, opts } = useAppSelector(Slice.Selectors.MultipleChoice);

    return (
        <Box
            display={questionType === "mc" ? "flex" : "none"}
            flexDirection="column"
            flexShrink={0}
        >
            {opts.a !== undefined && (
                <Node {...register("a")}>
                    <Opt opt={opts.a.value} id={opts.a.id} />
                </Node>
            )}
            {opts.b !== undefined && (
                <Node {...register("b")}>
                    <Opt opt={opts.b.value} id={opts.b.id} />
                </Node>
            )}
            {opts.c !== undefined && (
                <Node {...register("c")}>
                    <Opt opt={opts.c.value} id={opts.c.id} />
                </Node>
            )}
            {opts.d !== undefined && (
                <Node {...register("d")}>
                    <Opt opt={opts.d.value} id={opts.d.id} />
                </Node>
            )}
            <Node {...register("add-mc")}>
                <AddButton />
            </Node>
        </Box>
    );
}

export function Opt({ id, opt }: { id: string; opt: string }): React.ReactNode {
    const dispatch = useAppDispatch();
    const { opts, justAdded, hasErrors } = useAppSelector(Slice.Selectors.Opt);

    // Handle navigation
    const node = useNode();
    useNavigation(node);

    // Handle deletion.
    const { useEvent } = useKeymap({ deleteOpt: { input: "dd" } });
    useEvent("deleteOpt", () => {
        dispatch(Slice.Actions.deleteOpt(node.name as Slice.OptName));
    });

    // Handle text input
    const { onChange, setValue, value, enterInsert, insert } = useTextInput(opt ?? "");

    // Go straight into insert mode, but only if we just created this opt.
    const optJustAdded = justAdded[node.name];
    useEffect(() => {
        if (optJustAdded) {
            enterInsert();
        }
    }, [optJustAdded]);

    // Since opts cascade towards the beginning of the alphabet, when the id changes
    // we know we need to change the value
    useEffect(() => {
        setValue(opt);
    }, [id]);

    // Whenever the value changes, or the opts change, update errors.  Errors
    // occur when the opt doesn't have a unique value among the others.
    useEffect(() => {
        const optName = node.name as Slice.OptName;
        dispatch(Slice.Actions.updateOptValue({ optName, value }));
    }, [value]);

    useEffect(() => {
        if (opt !== undefined) {
            const optName = node.name as Slice.OptName;

            const otherValues = new Set<string>();

            Object.values(opts).forEach((opt) => {
                opt && opt.id !== id && otherValues.add(opt.value);
            });

            logger.write({
                otherValues: [...otherValues.values()],
                id,
                opt: opts[node.name],
            });

            const hasDup = otherValues.has(value);
            const isMt = value === "";

            dispatch(Slice.Actions.updateEmptyOptsInput({ optName, hasError: isMt }));
            dispatch(Slice.Actions.updateDuplicateOpt({ optName, hasError: hasDup }));
        }
    }, [opts, value, id]);

    // Apply styles
    const { title, boxStyles, textStyles, color } = getDecorators(node, {
        hasErrors: hasErrors(node.name),
        insert,
        type: "line",
    });

    return (
        <Box
            height={3}
            flexShrink={0}
            width="100"
            titleTopRight={{ title, color }}
            onClick={goToClickedNode(node)}
            styles={boxStyles}
        >
            <Text styles={textStyles}>{` ${node.name.toUpperCase()} | `}</Text>
            <TextInput onChange={onChange} textStyle={textStyles} />
        </Box>
    );
}

export function AddButton(): React.ReactNode {
    const dispatch = useAppDispatch();
    const opts = useAppSelector(Slice.Selectors.opts);

    const node = useNode();
    useNavigation(node);

    const { useEvent } = useKeymap({ pushMcQuestion: { key: "return" } });
    useEvent("pushMcQuestion", () => {
        dispatch(Slice.Actions.addMcInput());
    });

    const shouldRender = Object.values(opts).some((opt) => opt === undefined);

    const { boxStyles, textStyles, color, title } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    if (!shouldRender) return null;

    return (
        <Box
            height={3}
            width="100"
            flexShrink={0}
            styles={boxStyles}
            titleTopRight={{ title: title, color: color }}
            justifyContent="center"
            onClick={goToClickedNode(node)}
        >
            <Text styles={textStyles}>{"Add + "}</Text>
        </Box>
    );
}
