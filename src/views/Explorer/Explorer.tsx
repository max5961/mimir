import React from "react";
import { Box, Styles, Text, useKeymap } from "phileas";
import { TopicContext } from "./TopicContext.js";

const BASE_COLOR = "green";

const stretchBox: Styles["Box"] = {
    height: "100",
    width: "100",
    borderStyle: "round",
    borderColor: BASE_COLOR,
};

export function Explorer(): React.ReactNode {
    useKeymap({});

    return (
        <Box height="100" width="100" flexDirection="column">
            <Box
                width="100"
                height={3}
                flexShrink={0}
                borderStyle="round"
                borderColor={BASE_COLOR}
            >
                <Text color={BASE_COLOR}>{"/"}</Text>
            </Box>
            <TopicContext.Provider value={{ topic: "foo" }}>
                <Box styles={{ ...stretchBox, borderStyle: undefined }}>
                    <Box styles={stretchBox} flexShrink={1.25}></Box>
                    <Box styles={stretchBox}></Box>
                    <Box styles={stretchBox}></Box>
                </Box>
            </TopicContext.Provider>
        </Box>
    );
}

// export function Explorer(): React.ReactNode {
//     const [state, setState] = useState({
//         index: {} as Index,
//         topic: ROOT_TOPIC,
//         topics: [] as Topic["topics"],
//         questions: [] as Topic["questions"],
//     });
//
//     const fetch = {
//         async getTopic() {
//             const index: Index = await TopicService.getTopic(state.topic.id);
//
//             setState({
//                 index: index,
//                 topic: index.topic,
//                 topics: index.topic.topics,
//                 questions: index.topic.questions,
//             });
//         },
//         async postTopic(topicName: string) {
//             const nextIndex: Index = await TopicService.postTopic(
//                 state.topic.id,
//                 topicName,
//             );
//
//             setState({
//                 index: nextIndex,
//                 topic: nextIndex.topic,
//                 topics: nextIndex.topic.topics,
//                 questions: nextIndex.topic.questions,
//             });
//         },
//     };
//
//     useEffect(() => {
//         fetch.getTopic();
//     }, []);
//
//     const { listView, control } = useList(state.topics.length + state.questions.length);
//
//     const { useEvent } = useKeymap({
//         enterTopic: [{ key: "return" }, { input: "l" }],
//         prevTopic: [{ key: "backspace" }, { input: "h" }],
//     });
//
//     useEvent("enterTopic", async () => {
//         if (control.currentIndex >= state.topics.length) {
//             return;
//         }
//
//         const nextTopicId = state.topics[control.currentIndex]?.id;
//         const nextIndex: Index = await TopicService.getTopic(nextTopicId);
//
//         setState({
//             index: nextIndex,
//             topic: nextIndex.topic,
//             topics: nextIndex.topic.topics,
//             questions: nextIndex.topic.questions,
//         });
//
//         control.goToIndex(0);
//     });
//
//     useEvent("prevTopic", async () => {
//         const currTopicId = state.topic.id;
//         const prevTopicId = state.index.parentTopic?.id;
//         if (!prevTopicId) return;
//
//         const nextIndex: Index = await TopicService.getTopic(prevTopicId);
//
//         setState({
//             index: nextIndex,
//             topic: nextIndex.topic,
//             topics: nextIndex.topic.topics,
//             questions: nextIndex.topic.questions,
//         });
//
//         for (let i = 0; i < nextIndex.topic.topics.length; ++i) {
//             const topic = nextIndex.topic.topics[i];
//             if (topic.id === currTopicId) {
//                 control.goToIndex(i);
//             }
//         }
//     });
//
//     const styles: Styles["Box"] = {
//         height: "100",
//         width: "100",
//         borderStyle: "round",
//         borderColor: BASE_COLOR,
//     } as const;
//
//     const previewPath = state.topic.topics[control.currentIndex]?.name ?? "";
//
//     return (
//         <Viewport flexDirection="column">
//             <Box
//                 borderStyle="round"
//                 borderColor={BASE_COLOR}
//                 width="100"
//                 height={3}
//                 flexShrink={0}
//             >
//                 <Text wrap="truncate-end" color={BASE_COLOR} italic>
//                     {state.index.path}
//                 </Text>
//             </Box>
//             <Box height="100" width="100">
//                 <Box styles={styles} flexShrink={1.25}>
//                     <ParentTopic
//                         parentTopic={state.index.parentTopic}
//                         currTopic={state.index.topic}
//                     />
//                 </Box>
//                 <Box
//                     styles={styles}
//                     titleTopLeft={{
//                         title: `${state.index.path}${state.index.path?.endsWith("/") ? "" : "/"}${previewPath}`,
//                         color: BASE_COLOR,
//                     }}
//                 >
//                     <List listView={listView}>
//                         {state.topics.map((topic) => {
//                             return <TopicView key={topic.id} topic={topic} />;
//                         })}
//                         {state.questions.map((question) => {
//                             return <QuestionView key={question.id} question={question} />;
//                         })}
//                     </List>
//                 </Box>
//                 <Box
//                     styles={styles}
//                     flexDirection="column"
//                     titleTopCenter={{ title: "Preview", color: styles.borderColor }}
//                 >
//                     <Preview topic={state.topic} currentIndex={control.currentIndex} />
//                 </Box>
//             </Box>
//         </Viewport>
//     );
// }
//
// type TopicProps = {
//     topic: Topic;
// };
//
// function TopicView({ topic }: TopicProps): React.ReactNode {
//     const { isFocus } = useListItem();
//
//     return <TopicText name={topic.name} isFocus={isFocus} />;
// }
//
// function TopicText({
//     name,
//     isFocus,
//     colorize = true,
// }: {
//     name: string;
//     isFocus: boolean;
//     colorize?: boolean;
// }): React.ReactNode {
//     let bgColor = isFocus ? "magenta" : undefined;
//     const baseColor = colorize ? BASE_COLOR : undefined;
//
//     if (!colorize && isFocus) {
//         bgColor = "gray";
//     }
//
//     return (
//         <Box width="100" backgroundColor={bgColor}>
//             <Box height={1} width={2} backgroundColor={bgColor} flexShrink={0}>
//                 <Text color={isFocus ? undefined : "white"} wrap="truncate-end">
//                     {"☰ "}
//                 </Text>
//             </Box>
//             <Text bold color={isFocus ? undefined : baseColor} wrap="truncate-end">
//                 {name}
//             </Text>
//         </Box>
//     );
// }
//
// type QuestionProps = {
//     question: Topic["questions"][number];
// };
//
// function QuestionView({ question }: QuestionProps): React.ReactNode {
//     const { isFocus } = useListItem();
//
//     return <QuestionText name={question.question} isFocus={isFocus} />;
// }
//
// function QuestionText({
//     name,
//     isFocus,
//     colorize = true,
// }: {
//     name: string;
//     isFocus: boolean;
//     colorize?: boolean;
// }): React.ReactNode {
//     const bgColor = isFocus ? "magenta" : undefined;
//     const baseColor = colorize ? BASE_COLOR : undefined;
//
//     return (
//         <Box width="100" backgroundColor={bgColor}>
//             <Box height={1} width={2} backgroundColor="inherit" flexShrink={0}>
//                 <Text color={isFocus ? undefined : "white"} wrap="truncate-end">
//                     {isFocus ? "● " : "○ "}
//                 </Text>
//             </Box>
//             <Box width="100" height={1} backgroundColor="inherit">
//                 <Text
//                     italic
//                     dimColor={!isFocus}
//                     color={isFocus ? undefined : baseColor}
//                     wrap="truncate-end"
//                 >
//                     {name}
//                 </Text>
//             </Box>
//         </Box>
//     );
// }
//
// function ParentTopic({
//     parentTopic,
//     currTopic,
// }: {
//     parentTopic: Topic | null;
//     currTopic: Topic;
// }): React.ReactNode {
//     if (!parentTopic) {
//         return (
//             <Box width="100" height={1} backgroundColor="gray">
//                 <Text wrap="truncate-end" bold>
//                     {"☰ root"}
//                 </Text>
//             </Box>
//         );
//     }
//
//     return (
//         <Box height="100" width="100" flexDirection="column">
//             {parentTopic.topics.map((topic) => {
//                 return (
//                     <TopicText
//                         key={topic.id}
//                         name={topic.name}
//                         isFocus={topic.id === currTopic.id}
//                         colorize={false}
//                     />
//                 );
//             })}
//             {parentTopic.questions.map((question) => {
//                 return (
//                     <QuestionText
//                         key={question.id}
//                         name={question.question}
//                         isFocus={false}
//                         colorize={false}
//                     />
//                 );
//             })}
//         </Box>
//     );
// }
//
// function Preview({
//     topic,
//     currentIndex,
// }: {
//     topic: Topic;
//     currentIndex: number;
// }): React.ReactNode {
//     if (currentIndex < topic.topics.length) {
//         return (
//             <Box width="100" height="100" flexDirection="column">
//                 {topic.topics[currentIndex].topics.map((topic) => {
//                     return (
//                         <TopicText
//                             key={topic.id}
//                             name={topic.name}
//                             isFocus={false}
//                             colorize={false}
//                         />
//                     );
//                 })}
//                 {topic.topics[currentIndex].questions.map((question) => {
//                     return (
//                         <QuestionText
//                             key={question.id}
//                             name={question.question}
//                             isFocus={false}
//                             colorize={false}
//                         />
//                     );
//                 })}
//             </Box>
//         );
//     }
//
//     if (currentIndex < topic.topics.length + topic.questions.length) {
//         const question = topic.questions[currentIndex - topic.topics.length];
//
//         const type =
//             question.type === "mc"
//                 ? "Choice"
//                 : question.type === "qa"
//                   ? "Answer"
//                   : "Input";
//
//         return (
//             <Box height="100" width="100" flexDirection="column" overflow="hidden">
//                 <Box
//                     width="100"
//                     borderStyle="round"
//                     borderColor="cyan"
//                     titleTopLeft={{ title: "Question", color: "cyan" }}
//                     flexShrink={0}
//                 >
//                     <Text color="cyan" dimColor>
//                         {question.question}
//                     </Text>
//                 </Box>
//                 <HorizontalLine dimColor color="green" />
//                 {!question.A && (
//                     <Box
//                         width="100"
//                         borderStyle="round"
//                         borderColor="green"
//                         titleTopLeft={{
//                             title: "Answer",
//                             color: "green",
//                         }}
//                         titleTopRight={{
//                             title: question.type === "qi" ? "[input]" : "",
//                             color: "green",
//                         }}
//                         flexShrink={0}
//                     >
//                         <Text color="green" dimColor>
//                             {question.answer}
//                         </Text>
//                     </Box>
//                 )}
//                 {question.A && (
//                     <Text
//                         color={
//                             question.answer.toUpperCase() === "A" ? "green" : undefined
//                         }
//                     >{`A: ${question.A}`}</Text>
//                 )}
//                 {question.B && (
//                     <Text
//                         color={
//                             question.answer.toUpperCase() === "B" ? "green" : undefined
//                         }
//                     >{`B: ${question.B}`}</Text>
//                 )}
//                 {question.C && (
//                     <Text
//                         color={
//                             question.answer.toUpperCase() === "C" ? "green" : undefined
//                         }
//                     >{`C: ${question.C}`}</Text>
//                 )}
//                 {question.D && (
//                     <Text
//                         color={
//                             question.answer.toUpperCase() === "D" ? "green" : undefined
//                         }
//                     >{`D: ${question.D}`}</Text>
//                 )}
//             </Box>
//         );
//     }
// }
