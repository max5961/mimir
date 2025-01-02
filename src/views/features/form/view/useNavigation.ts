import { KeyMap, useKeymap, useNode } from "phileas";

type Node = ReturnType<typeof useNode>;

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

export function goToNode(node: Node) {
    return (char: string) => {
        const number = Number(char);
        !Number.isNaN(number) && node.control.goToNode(number - 1);
    };
}

export function goToClickedNode(node: Node) {
    return () => {
        node.control.goToNode(node.name);
    };
}

// Because the QuestionType component need special controls
export function useNavigation(node: Node) {
    const { useEvent } = useKeymap(questionViewKeymap);

    useEvent("up", node.control.up);
    useEvent("down", node.control.down);
    useEvent("left", node.control.left);
    useEvent("right", node.control.right);
    useEvent("nextNode", node.control.next);
    useEvent("goToNode", goToNode(node));
}
