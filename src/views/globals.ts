import { Color } from "phileas";

type Colors = {
    Primary: Color;
    Secondary: Color;
    Alt: Color;
    ShallowFocus: Color;
    Error: Color;
    Warn: Color;
};

export const Colors: Colors = {
    Primary: "green",
    Secondary: "magenta",
    Alt: "cyan",
    ShallowFocus: "gray",
    Error: "red",
    Warn: "yellow",
};

// export const Colors: Colors = {
//     Primary: "magenta",
//     Secondary: "green",
//     Alt: "blue",
//     ShallowFocus: "gray",
//     Error: "red",
//     Warn: "yellow",
// };
