import { Decks } from "./DeckModel.js";
import { sampleRoot } from "./sampleTopicModel.js";

export const sampleDecks: Decks = {
    active: [
        { ...sampleRoot.questions[0], path: "/" },
        { ...sampleRoot.questions[1], path: "/" },
        { ...sampleRoot.questions[2], path: "/" },
        { ...sampleRoot.questions[3], path: "/" },
        { ...sampleRoot.questions[4], path: "/" },
        { ...sampleRoot.questions[5], path: "/" },
        { ...sampleRoot.questions[6], path: "/" },
        { ...sampleRoot.questions[7], path: "/" },
    ],
    saved: {
        ["pl1"]: {
            id: "pl1",
            name: "General Knowledge",
            deck: [
                { ...sampleRoot.questions[2], path: "/" },
                { ...sampleRoot.questions[3], path: "/" },
                { ...sampleRoot.subTopics[0].questions[1], path: "/Science" },
                { ...sampleRoot.subTopics[1].questions[1], path: "/History" },
            ],
        },
    },
};
