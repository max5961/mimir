import { Color } from "tuir";

type Colors = {
    Primary: Color;
    Secondary: Color;
    Alt: Color;
    ShallowFocus: Color;
    Error: Color;
    Success: Color;
    Warn: Color;
};

export const Colors: Colors = {
    Primary: "green",
    Secondary: "magenta",
    Alt: "cyan",
    ShallowFocus: "gray",
    Error: "red",
    Success: "green",
    Warn: "yellow",
};

type Icons = {
    Check: string;
    X: string;
    SingleLine: string;
    MultiLine: string;
    Bullet: string;
};

export const Icons: Icons = {
    Check: "✓",
    X: "✕",
    SingleLine: "─",
    MultiLine: "≡",
    Bullet: "⏺",
};
