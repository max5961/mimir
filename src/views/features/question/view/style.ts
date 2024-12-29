import { Styles } from "phileas";
import { Colors } from "../../../globals.js";

export const QStyles: { FocusedBox: Styles["Box"]; UnfocusedBox: Styles["Box"] } = {
    UnfocusedBox: {
        borderStyle: "round",
        borderColor: Colors.Alt,
    },
    FocusedBox: {
        borderStyle: "bold",
        borderColor: Colors.Primary,
    },
};
