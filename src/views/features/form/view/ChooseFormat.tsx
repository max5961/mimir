import React, { useEffect } from "react";
import { Box, Text, List, useNode, useList, useKeymap } from "phileas";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { goToNode, questionViewKeymap } from "./useNavigation.js";
import { QuestionModel } from "../../../../models/QuestionModel.js";
import { getDecorators } from "./decorators.js";
import * as Slice from "../formSlice.js";

const QuestionFormat = {
    QA: "Question/Answer",
    QI: "Question/Input",
    MC: "Multiple Choice",
};
const questionTypes = [QuestionFormat.QA, QuestionFormat.QI, QuestionFormat.MC];

export default function ChooseFormat(): React.ReactNode {
    const dispatch = useAppDispatch();
    const { type } = useAppSelector(Slice.Selectors.QuestionInput);
    const list = useList(questionTypes, { navigation: "none" });
    const node = useNode();

    function down() {
        if (list.control.currentIndex < list.items.length - 1) {
            list.control.nextItem();
        } else {
            node.control.down();
        }
    }

    function setType() {
        let nextType: QuestionModel["type"] = "qa";
        if (list.control.currentIndex === 1) nextType = "qi";
        if (list.control.currentIndex === 2) nextType = "mc";

        dispatch(Slice.Actions.setQuestionType(nextType));
    }

    const { useEvent } = useKeymap({ ...questionViewKeymap, setType: { key: "return" } });

    useEvent("down", down);
    useEvent("up", list.control.prevItem);
    useEvent("goToNode", goToNode(node));
    useEvent("setType", setType);

    useEffect(() => {
        type !== "mc" && dispatch(Slice.Actions.setInvalidMcAnswer(false));
    }, [type]);

    const { color, boxStyles, title } = getDecorators(node, {
        hasErrors: false,
        insert: false,
        type: "button",
    });

    return (
        <Box
            height={5}
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
            <List listView={list.listView} scrollbar={{ hide: true }}>
                {list.items.map((item, idx) => {
                    const isShallowFocus = list.control.currentIndex === idx;

                    let isChosen = false;
                    if (item === QuestionFormat.QA && type === "qa") isChosen = true;
                    if (item === QuestionFormat.QI && type === "qi") isChosen = true;
                    if (item === QuestionFormat.MC && type === "mc") isChosen = true;

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
