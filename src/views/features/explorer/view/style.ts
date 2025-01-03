import { Styles } from "tuir";
import { Colors } from "../../../globals.js";

export const EStyles: { MaxDim: Styles["Box"]; ColumnBox: Styles["Box"] } = {
    MaxDim: { height: "100", width: "100" },
    ColumnBox: {
        height: "100",
        width: "100",
        borderStyle: "round",
        borderColor: Colors.Primary,
        flexDirection: "column",
    },
} as const;
