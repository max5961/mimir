import { KeyMap, logger, useKeymap, useNode } from "phileas";

export const questionViewKeymap = {
    up: [{ input: "k" }, { key: "up" }],
    down: [{ input: "j" }, { key: "down" }],
    left: [{ input: "h" }, { key: "left" }],
    right: [{ input: "l" }, { key: "right" }],
    nextNode: { key: "tab" },
    goToNode: [
        { input: "1" },
        { input: "2" },
        { input: "3" },
        { input: "4" },
        { input: "5" },
        { input: "6" },
        { input: "7" },
        { input: "8" },
        { input: "9" },
    ],
} satisfies KeyMap;

export const handleGoToNode = (node: ReturnType<typeof useNode>) => (char: string) => {
    const number = Number(char);
    if (isNaN(number)) return;
    node.control.goToNode(number - 1);
};

// Because the QuestionType component need special controls
export default function useNavigation(node: ReturnType<typeof useNode>) {
    const { useEvent } = useKeymap(questionViewKeymap);
    useEvent("up", node.control.up);
    useEvent("down", node.control.down);
    useEvent("left", node.control.left);
    useEvent("right", node.control.right);
    useEvent("nextNode", node.control.next);
    useEvent("goToNode", handleGoToNode(node));
}
