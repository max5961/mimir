import { test, describe, expect, beforeAll } from "vitest";
import { DataBase, RootTopicName } from "./DataBase.js";
import { db } from "./db.js";
import { QuestionModel } from "../models/QuestionModel.js";
import { SavedDeck } from "../models/DeckModel.js";

const question1: QuestionModel = {
    id: "q1",
    type: "qa",
    question: "foobar-1",
    answer: "bazqux-1",
};

const question2: QuestionModel = {
    id: "q2",
    type: "qa",
    question: "foobar-2",
    answer: "bazqux-2",
};

const question3: QuestionModel = {
    id: "q3",
    type: "qa",
    question: "foobar-3",
    answer: "bazqux-3",
};

const question4: QuestionModel = {
    id: "q4",
    type: "qa",
    question: "foobar-4",
    answer: "bazqux-4",
};

const savedPl1: SavedDeck = {
    id: "savedPl1",
    name: "FooPlaylist",
    playlist: [
        { path: "/", ...question1 },
        { path: "/", ...question2 },
        { path: "/", ...question3 },
        { path: "/", ...question4 },
    ],
};

beforeAll(async () => {
    DataBase.initializeDataBaseSync();

    await DataBase.saveTopics({
        id: "1",
        name: RootTopicName,
        questions: [],
        subTopics: [
            {
                id: "2_1",
                name: "Foo",
                questions: [question1, question2],
                subTopics: [
                    {
                        id: "3_1",
                        name: "Baz",
                        questions: [],
                        subTopics: [
                            { id: "4_1", name: "Qux", questions: [], subTopics: [] },
                        ],
                    },
                ],
            },
            {
                id: "2_2",
                name: "Bar",
                questions: [],
                subTopics: [],
            },
        ],
    });

    await DataBase.saveDecks({
        active: [
            { path: "/", ...question1 },
            { path: "/", ...question2 },
        ],
        saved: [savedPl1],
    });
});

describe("db.getTopicDataById", () => {
    test("1", async () => {
        const data = await db.getTopicDataById("1");
        expect(data?.currentTopic.name).toBe(RootTopicName);
    });

    test("2_1", async () => {
        const data = await db.getTopicDataById("2_1");
        expect(data?.currentTopic.name).toBe("Foo");
    });

    test("2_2", async () => {
        const data = await db.getTopicDataById("2_2");
        expect(data?.currentTopic.name).toBe("Bar");
    });

    test("3_1", async () => {
        const data = await db.getTopicDataById("3_1");
        expect(data?.currentTopic.name).toBe("Baz");
    });
});

describe("db.getTopicById", () => {
    test("1", async () => {
        const data = await db.getTopicById("1");
        expect(data?.name).toBe(RootTopicName);
    });

    test("2_1", async () => {
        const data = await db.getTopicById("2_1");
        expect(data?.name).toBe("Foo");
    });

    test("2_2", async () => {
        const data = await db.getTopicById("2_2");
        expect(data?.name).toBe("Bar");
    });

    test("3_1", async () => {
        const data = await db.getTopicById("3_1");
        expect(data?.name).toBe("Baz");
    });
});

describe("db.getParentTopicById", () => {
    test("1", async () => {
        const parent = await db.getParentTopicById("1");
        expect(parent).toBe(null);
    });

    test("2_1", async () => {
        const parent = await db.getParentTopicById("2_1");
        expect(parent?.name).toBe(RootTopicName);
    });

    test("3_1", async () => {
        const parent = await db.getParentTopicById("3_1");
        expect(parent?.name).toBe("Foo");
    });
});

describe("Reading data gets correct topic path", () => {
    test("/", async () => {
        const data = await db.getTopicDataById("1");
        expect(data?.currentPath).toBe("/");
    });

    test("/Foo", async () => {
        const data = await db.getTopicDataById("2_1");
        expect(data?.currentPath).toBe("/Foo");
    });

    test("/Bar", async () => {
        const data = await db.getTopicDataById("2_2");
        expect(data?.currentPath).toBe("/Bar");
    });

    test("/Foo/Baz", async () => {
        const data = await db.getTopicDataById("3_1");
        expect(data?.currentPath).toBe("/Foo/Baz");
    });

    test("/Foo/Baz/Qux", async () => {
        const data = await db.getTopicDataById("4_1");
        expect(data?.currentPath).toBe("/Foo/Baz/Qux");
    });
});

test("db.getTopicDataById gets correct nodes", async () => {
    let data = await db.getTopicDataById("1");
    expect(data?.parentTopic).toBe(null);

    data = await db.getTopicDataById("2_1");
    expect(data?.parentTopic?.name).toBe(RootTopicName);
    expect(data?.currentTopic.name).toBe("Foo");

    data = await db.getTopicDataById("2_2");
    expect(data?.parentTopic?.name).toBe(RootTopicName);
    expect(data?.currentTopic.name).toBe("Bar");

    data = await db.getTopicDataById("3_1");
    expect(data?.parentTopic?.name).toBe("Foo");
    expect(data?.currentTopic.name).toBe("Baz");
});

test("db.getQuestionDataById gets correct questions", async () => {
    let question = await db.getQuestionDataById("q1");
    expect(question?.question).toBe("foobar-1");
    expect(question?.id).toBe("q1");

    question = await db.getQuestionDataById("q2");
    expect(question?.question).toBe("foobar-2");
    expect(question?.id).toBe("q2");
});

describe("Invalid ids return null", () => {
    test("invalid id", async () => {
        const data1 = await db.getTopicDataById("invalid_id");
        expect(data1).toBe(null);

        const question = await db.getQuestionDataById("invalid_id");
        expect(question).toBe(null);
    });

    test("getTopicDataById with Question id", async () => {
        const data = await db.getTopicDataById("q1");
        expect(data).toBe(null);
    });

    test("getQuestionDataById with Topic id", async () => {
        const data = await db.getQuestionDataById("1");
        expect(data).toBe(null);
    });
});

describe("Playlist data", () => {
    const newPlaylist: SavedDeck = {
        id: "newPlaylist",
        name: "New Playlist",
        playlist: [{ id: "1", path: "/", type: "qa", question: "Foo", answer: "Bar" }],
    };

    test("Get active playlist", async () => {
        const [q1, q2] = await db.getActiveDeck();
        expect(q1).toEqual({ path: "/", ...question1 });
        expect(q2).toEqual({ path: "/", ...question2 });
    });

    test("Get playlist data by id", async () => {
        const pl = await db.getSavedDeckById(savedPl1.id);
        expect(pl).toEqual(savedPl1);
    });

    test("Get all playlists", async () => {
        const all = await db.getAllSavedDecks();
        expect(all).toEqual([savedPl1]);
    });

    test("Save new playlist", async () => {
        await db.saveDeck(newPlaylist);

        const all = await db.getAllSavedDecks();
        expect(all).toEqual([savedPl1, newPlaylist]);
    });

    test("Save existing playlist", async () => {
        const updatedPlaylist: SavedDeck = { ...savedPl1, name: "Updated Playlist" };
        await db.saveDeck(updatedPlaylist);

        const all = await db.getAllSavedDecks();
        expect(all).toEqual([updatedPlaylist, newPlaylist]);
    });
});
