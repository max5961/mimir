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
    logger,
} from "tuir";
import { goToClickedNode, useNavigation } from "./useNavigation.js";
import { getDecorators } from "./decorators.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import * as Slice from "../formSlice.js";
import { MultipleChoiceOpt } from "../../../../models/QuestionModel.js";

const Prompt = "Choose an option";

export function MultipleChoiceDropDown(): React.ReactNode {
    const { answerId, opts } = useAppSelector(Slice.Selectors.DropDown);
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

    const answerValue = opts.find((opt) => opt.id === answerId)?.value;

    const prompt = opts.length ? (answerValue ?? Prompt) : "Add some options";

    return (
        <Box height="100" width="100" onClick={goToClickedNode(node)}>
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
                onClick={() => {
                    goToClickedNode(node);
                }}
            >
                <DropDownBox modalShowing={modalShowing}>
                    <DropDown />
                </DropDownBox>
            </Modal>
        </Box>
    );
}

function DropDown(): React.ReactNode {
    const { opts, answerId } = useAppSelector(Slice.Selectors.DropDown);

    const selectOpts = [Prompt, ...opts];

    const startIndex = useMemo(() => {
        let idx = 0;

        for (let i = 0; i < selectOpts.length; ++i) {
            if ((selectOpts[i] as (typeof opts)[number]).id === answerId) {
                idx = i;
            }
        }

        return idx;
    }, []);

    const { listView } = useList(selectOpts.length, { unitSize: 1, startIndex });

    const selectedIdx = opts.findIndex((opt) => opt.id === answerId);

    return (
        <List listView={listView} scrollbar={{ hide: true }}>
            {selectOpts.map((opt, idx) => {
                const key = typeof opt === "string" ? opt : opt.id;
                const isSelected = !!idx && selectedIdx === idx - 1;

                return <SelectOption key={key} opt={opt} isSelected={isSelected} />;
            })}
        </List>
    );
}

function SelectOption({
    opt,
    isSelected,
}: {
    opt: string | MultipleChoiceOpt;
    isSelected: boolean;
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
        const answer = typeof opt === "string" ? undefined : opt.id;
        dispatch(Slice.Actions.updateMultipleChoiceAnswer(answer));
        hideModal();
    });

    let textContent = typeof opt === "string" ? opt : opt.value;

    if (isSelected) {
        textContent = `✔ ${textContent}`;
    }

    return (
        <Box
            backgroundColor={bgColor}
            height={1}
            width="100"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Text wrap="truncate-end">{textContent}</Text>
        </Box>
    );
}

type DDBoxProps = { modalShowing: boolean } & React.PropsWithChildren;

function DropDownBox({ modalShowing, children }: DDBoxProps): React.ReactNode {
    const node = useNode();
    const hasNoSelection = useAppSelector(Slice.Selectors.emptyMcSelection);

    const { boxStyles, color, marker } = getDecorators(node, {
        hasErrors: hasNoSelection,
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
