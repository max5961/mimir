import React, { useEffect, useMemo } from "react";
import {
    Box,
    Text,
    Modal,
    List,
    useList,
    useModal,
    useKeymap,
    useHideModal,
    useNode,
    useListItem,
} from "phileas";
import { useNavigation } from "./useNavigation.js";
import { getDecorators } from "./decorators.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../formSlice.js";

const Prompt = "Choose an option";

export function MultipleChoiceDropDown(): React.ReactNode {
    const { multipleChoiceAnswer, opts } = useAppSelector(Slice.Selectors.DropDown);
    const node = useNode();
    useNavigation(node);
    const { modal, showModal } = useModal({
        show: null,
        hide: null,
    });

    const modalShowing = modal._vis;
    const { color } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    const { useEvent } = useKeymap({ showModal: { key: "return" } });
    useEvent("showModal", () => {
        if (opts.length) {
            showModal();
        }
    });

    const prompt = opts.length ? (multipleChoiceAnswer ?? Prompt) : "Add some options";

    return (
        <Box height="100" width="100">
            {!modalShowing && (
                <DropDownBox modalShowing={modalShowing}>
                    <Box
                        backgroundColor={color}
                        width="100"
                        height={1}
                        justifyContent="center"
                    >
                        <Text wrap="truncate-end">{prompt}</Text>
                    </Box>
                </DropDownBox>
            )}
            <Modal
                modal={modal}
                justifySelf="flex-start"
                alignSelf="flex-start"
                width="100"
            >
                <DropDownBox modalShowing={modalShowing}>
                    <DropDown />
                </DropDownBox>
            </Modal>
        </Box>
    );
}

function DropDown(): React.ReactNode {
    const { opts, multipleChoiceAnswer } = useAppSelector(Slice.Selectors.DropDown);

    const selectOpts = [Prompt, ...opts];

    const startIndex = useMemo(() => {
        let idx = 0;
        for (let i = 0; i < selectOpts.length; ++i) {
            if (selectOpts[i] === multipleChoiceAnswer) idx = i;
        }
        return idx;
    }, []);

    const { listView } = useList(selectOpts.length, { unitSize: 1, startIndex });

    return (
        <List listView={listView} scrollbar={{ hide: true }}>
            {selectOpts.map((opt) => {
                return (
                    <SelectOption
                        key={opt}
                        item={opt as Exclude<Slice.MCAnswer, undefined>}
                    />
                );
            })}
        </List>
    );
}

function SelectOption({
    item,
}: {
    item: typeof Prompt | "A" | "B" | "C" | "D";
}): React.ReactNode {
    const node = useNode();
    const dispatch = useAppDispatch();
    const { isFocus } = useListItem();
    const { hideModal } = useHideModal();

    const { color } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    const bgColor = isFocus ? color : undefined;

    const { useEvent } = useKeymap({ choose: { key: "return" } });
    useEvent("choose", () => {
        const answer = item === Prompt ? undefined : item;
        dispatch(Slice.Actions.updateMultipleChoiceAnswer(answer));
        hideModal();
    });

    return (
        <Box
            backgroundColor={bgColor}
            height={1}
            width="100"
            justifyContent="center"
            alignItems="center"
        >
            <Text>{item}</Text>
        </Box>
    );
}

type DDBoxProps = { modalShowing: boolean } & React.PropsWithChildren;

function DropDownBox({ modalShowing, children }: DDBoxProps): React.ReactNode {
    const node = useNode();
    const error = useAppSelector(Slice.Selectors.multipleChoiceDropDownError);

    const { boxStyles, color, marker } = getDecorators(node, {
        hasErrors: error,
        insert: false,
        type: "button",
    });

    const height = modalShowing ? undefined : 3;

    return (
        <Box
            height={height}
            width="100"
            titleTopLeft={{ title: "Multiple Choice Answer", color }}
            titleTopRight={{ title: marker, color }}
            justifyContent="center"
            styles={boxStyles}
        >
            {children}
        </Box>
    );
}
