import { Styles, useNode } from "tuir";
import { Colors } from "../../../globals.js";
import { InputReturnAction } from "../formSlice.js";

type Node = ReturnType<typeof useNode>;

export function getDecorators(
    node: Node,
    opts: {
        hasErrors: boolean;
        insert: boolean;
        type: "line" | "area" | "button";
        returnAction?: InputReturnAction;
    },
) {
    /**** color *****/
    let color = node.isFocus ? Colors.Primary : Colors.Alt;
    if (opts.hasErrors) {
        color = Colors.Error;
    }

    /***** boxStyles *****/
    const boxStyles: Styles["Box"] = {
        borderStyle: node.isFocus ? "bold" : "round",
        borderColor: color,
    };

    /***** textStyles *****/
    const textStyles: Styles["Text"] = { color };

    /***** marker *****/
    const marker = `[${node.control.getNodeIndex(node.name) + 1}]`;

    /***** title *****/
    let title = marker;
    if (opts.type !== "button" && node.isFocus) {
        if (opts.type === "line") {
            title = opts.insert
                ? "[Return/Esc to stop]"
                : "[Return/i to edit, dd to delete]";
        } else {
            if (opts.returnAction === "exit") {
                title = opts.insert ? "[Esc/Return to stop]" : "[Return/i to edit]";
            } else {
                title = opts.insert ? "[Esc to stop]" : "[Return/i to edit]";
            }
        }
    }

    return { color, boxStyles, textStyles, marker, title };
}
