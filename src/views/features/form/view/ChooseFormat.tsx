import React from "react";
import { Box, Text, List, useNode, useList, useKeymap } from "phileas";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { goToClickedNode, goToNode, questionViewKeymap } from "./useNavigation.js";
import { QuestionModel } from "../../../../models/QuestionModel.js";
import { getDecorators } from "./decorators.js";
import * as Slice from "../formSlice.js";

const QuestionType = {
    QA: "Question/Answer",
    QI: "Question/Input",
    MC: "Multiple Choice",
} as const;
const questionTypes = [QuestionType.QA, QuestionType.QI, QuestionType.MC];

export default function ChooseFormat(): React.ReactNode {
    const dispatch = useAppDispatch();
    const questionType = useAppSelector(Slice.Selectors.questionType);
    const node = useNode();
    const list = useList(questionTypes, {
        navigation: "none",
        windowSize: 3,
        unitSize: "stretch",
    });

    const setType = () => {
        let nextType: QuestionModel["type"] = "qa";
        if (list.control.currentIndex === 1) nextType = "qi";
        if (list.control.currentIndex === 2) nextType = "mc";

        dispatch(Slice.Actions.setQuestionType(nextType));
    };

    const { useEvent } = useKeymap({ ...questionViewKeymap, setType: { key: "return" } });

    useEvent("left", list.control.prevItem);
    useEvent("right", list.control.nextItem);
    useEvent("down", node.control.down);
    useEvent("goToNode", goToNode(node));
    useEvent("setType", setType);

    const { color, boxStyles, title } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    return (
        <Box
            height={3}
            flexShrink={0}
            titleTopLeft={{
                title: "Type",
                color: color,
            }}
            titleTopRight={{
                title,
                color,
            }}
            styles={boxStyles}
        >
            <List listView={list.listView} flexDirection="row" scrollbar={{ hide: true }}>
                {list.items.map((item, idx) => {
                    const isShallowFocus = list.control.currentIndex === idx;

                    let isChosen = false;
                    if (item === QuestionType.QA && questionType === "qa")
                        isChosen = true;
                    if (item === QuestionType.QI && questionType === "qi")
                        isChosen = true;
                    if (item === QuestionType.MC && questionType === "mc")
                        isChosen = true;

                    const prefix = isChosen ? "[ X ]" : "[   ]";

                    return (
                        <Box
                            key={item}
                            width="100"
                            height={1}
                            justifyContent="center"
                            onClick={() => {
                                let format: QuestionModel["type"] = "qa";
                                if (item === QuestionType.QI) format = "qi";
                                if (item === QuestionType.MC) format = "mc";
                                dispatch(Slice.Actions.setQuestionType(format));

                                goToClickedNode(node)();
                                list.control.goToIndex(idx);
                            }}
                        >
                            <Text
                                underline={isShallowFocus && node.isFocus}
                                color={color}
                            >{`${prefix}: ${item}`}</Text>
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
}
