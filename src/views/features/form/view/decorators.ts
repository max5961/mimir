import { Styles, useNode } from "phileas";
import { Colors } from "../../../globals.js";

type Node = ReturnType<typeof useNode>;

export function getDecorators(
    node: Node,
    opts: { hasErrors: boolean; insert: boolean; type: "line" | "area" | "button" },
) {
    /**** color *****/
    let color = node.isFocus ? Colors.Alt : Colors.Primary;
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
            title = opts.insert ? "Return/Esc to stop" : "Return/i to edit";
        } else {
            title = opts.insert ? "Esc to stop" : "Return/i to edit";
        }
    }

    return { color, boxStyles, textStyles, marker, title };
}
