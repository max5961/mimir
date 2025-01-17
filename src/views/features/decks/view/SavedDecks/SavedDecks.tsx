import React from "react";
import { Box, HorizontalLine, Modal, Text, useModal } from "tuir";

export function SavedDecks(): React.ReactNode {
    const { modal, showModal, hideModal } = useModal({
        show: { input: "a" },
        hide: [{ key: "esc" }, { input: "a" }],
    });

    return (
        <Modal
            modal={modal}
            height="100"
            width="25"
            borderStyle="round"
            borderLeft={false}
            borderTop={false}
            borderBottom={false}
            alignSelf="center"
            justifySelf="flex-start"
        >
            <ModalContent />
        </Modal>
    );
}

function ModalContent(): React.ReactNode {
    return (
        <Box flexBasis="100" flexDirection="column" paddingTop={1}>
            <PaddedBox>
                <Text>Saved Decks</Text>
            </PaddedBox>
            <HorizontalLine />
        </Box>
    );
}

function PaddedBox(props: React.PropsWithChildren): React.ReactNode {
    return (
        <Box width="100" paddingLeft={2}>
            {props.children}
        </Box>
    );
}
