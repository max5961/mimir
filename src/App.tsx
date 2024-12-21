import React from "react";
import { Box, Text, useKeymap, Viewport } from "phileas";

type Props = {
    port: number;
};

export default function App({ port }: Props): React.ReactNode {
    useKeymap({});

    return (
        <Viewport alignItems="center" justifyContent="center">
            <Text>{port}</Text>
        </Viewport>
    );
}
