import { Playlists } from "./PlaylistsModel.js";
import { sampleRoot } from "./sampleTopicModel.js";

export const samplePlaylists: Playlists = {
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
    saved: [
        {
            id: "pl1",
            name: "General Knowledge",
            playlist: [
                { ...sampleRoot.questions[2], path: "/" },
                { ...sampleRoot.questions[3], path: "/" },
                { ...sampleRoot.subTopics[0].questions[1], path: "/Science" },
                { ...sampleRoot.subTopics[1].questions[1], path: "/History" },
            ],
        },
    ],
};
