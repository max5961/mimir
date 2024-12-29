import React, { useEffect } from "react";
import { Box, Text, List, useNode, useList, useKeymap } from "phileas";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import {
    selectQuestion,
    setInvalidMcAnswer,
    setQuestionType,
} from "../questionFormSlice.js";
import { Colors } from "../../../globals.js";
import { QStyles } from "./style.js";
import { handleGoToNode, questionViewKeymap } from "./useNavigation.js";
import { QuestionModel } from "../../../../models/QuestionModel.js";

export default function TypeView(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { type } = useAppSelector(selectQuestion);
    const node = useNode();
    const nodeIndex = node.control.getNodeIndex(node.name) + 1;

    const list = useList(["Question/Answer", "Question/Input", "Multiple Choice"], {
        navigation: "none",
    });

    const { useEvent } = useKeymap({ ...questionViewKeymap, setType: { key: "return" } });

    useEvent("down", () => {
        if (list.control.currentIndex < list.items.length - 1) {
            return list.control.nextItem();
        }
        node.control.down();
    });

    useEvent("up", list.control.prevItem);
    useEvent("goToNode", handleGoToNode(node));
    useEvent("setType", () => {
        let nextType: QuestionModel["type"] = "qa";
        if (list.control.currentIndex === 1) nextType = "qi";
        if (list.control.currentIndex === 2) nextType = "mc";

        dispatch(setQuestionType(nextType));
    });

    useEffect(() => {
        type !== "mc" && dispatch(setInvalidMcAnswer(false));
    }, [type]);

    const boxStyles = node.isFocus ? QStyles.FocusedBox : QStyles.UnfocusedBox;
    const color = node.isFocus ? Colors.Primary : Colors.Alt;

    return (
        <Box
            height={5}
            flexShrink={0}
            titleTopLeft={{
                title: "Type",
                color: color,
            }}
            titleTopRight={{
                title: `[${nodeIndex}]`,
                color: color,
            }}
            styles={boxStyles}
        >
            <List listView={list.listView} scrollbar={{ hide: true }}>
                {list.items.map((item, idx) => {
                    const isShallowFocus = list.control.currentIndex === idx;
                    const color = node.isFocus ? Colors.Primary : Colors.Alt;

                    let isChosen = false;
                    if (item === "Question/Answer" && type === "qa") isChosen = true;
                    if (item === "Question/Input" && type === "qi") isChosen = true;
                    if (item === "Multiple Choice" && type === "mc") isChosen = true;

                    const prefix = isChosen ? "[ X ]" : "[   ]";

                    return (
                        <Text
                            key={item}
                            underline={isShallowFocus && node.isFocus}
                            color={color}
                        >{`${prefix}: ${item}`}</Text>
                    );
                })}
            </List>
        </Box>
    );
}
