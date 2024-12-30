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
import { NodeNames } from "./Form.js";
import { getDecorators } from "./decorators.js";
import { useNavigation } from "./useNavigation.js";
import * as Slice from "../formSlice.js";

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
    const { opts, invalidOpts } = useAppSelector(Slice.Selectors.Opt);
    const node = useNode();
    useNavigation(node);

    // Handle deletion.
    const { useEvent } = useKeymap({ deleteOpt: { input: "dd" } });
    useEvent("deleteOpt", () => {
        dispatch(Slice.Actions.deleteMultipleChoiceOpt(node.name as Slice.OptName));
    });

    // Handle text input
    const { onChange, setValue, value, enterInsert, insert } = useTextInput(opt ?? "");

    // Since opts cascade towards the beginning of the alphabet, when the id changes
    // we know we need to change the value
    useEffect(() => {
        setValue(opt);
    }, [id]);

    // Go straight into insert mode, but only if we just created this opt.
    const shouldDisplay = opts[node.name] !== undefined;
    useEffect(() => {
        if (shouldDisplay) {
            enterInsert();
        }
    }, [shouldDisplay]);

    // Whenever the value changes, or the opts change, update errors.  Errors
    // occur when the opt doesn't have a unique value among the others.
    useEffect(() => {
        if (opt !== undefined) {
            const optName = node.name as Slice.OptName;

            const otherValues = new Set<string>();

            Object.values(opts).forEach((opt) => {
                opt && opt.id !== id && otherValues.add(opt.value);
            });

            const hasError = otherValues.has(value) || value === "";

            // Update the value too so that opts are updated and other opts check for errors as well
            dispatch(Slice.Actions.updateMultipleChoiceValue({ optName, value }));
            dispatch(Slice.Actions.updateMultipleChoiceErrors({ optName, hasError }));
        }
    }, [value, opts]);

    // Apply styles
    const { title, boxStyles, textStyles, color } = getDecorators(node, {
        hasErrors: invalidOpts[node.name],
        insert,
        type: "line",
    });

    return (
        <Box
            height={3}
            flexShrink={0}
            width="100"
            styles={boxStyles}
            titleTopRight={{ title, color }}
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
        dispatch(Slice.Actions.addMultipleChoiceInput());
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
        >
            <Text styles={textStyles}>{"Add + "}</Text>
        </Box>
    );
}
