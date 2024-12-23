import { test, describe, expect } from "vitest";
import { DataBase, RootTopicName } from "../../database/DataBase.js";
import Controller from "./topicsController.js";

DataBase.initializeDataBase();
DataBase.saveDb({
    id: "1",
    name: RootTopicName,
    questions: [],
    topics: [
        {
            id: "2_1",
            name: "Foo",
            questions: [
                { id: "q1", type: "qa", question: "foobar-1", answer: "bazqux-1" },
                { id: "q2", type: "qa", question: "foobar-2", answer: "bazqux-2" },
            ],
            topics: [
                {
                    id: "3_1",
                    name: "Baz",
                    questions: [],
                    topics: [{ id: "4_1", name: "Qux", questions: [], topics: [] }],
                },
            ],
        },
        {
            id: "2_2",
            name: "Bar",
            questions: [],
            topics: [],
        },
    ],
});

test("Builds topic path", async () => {
    let data = await Controller.getTopicDataById("1");
    expect(data?.path).toBe("/");

    data = await Controller.getTopicDataById("2_1");
    expect(data?.path).toBe("/Foo");

    data = await Controller.getTopicDataById("2_2");
    expect(data?.path).toBe("/Bar");

    data = await Controller.getTopicDataById("3_1");
    expect(data?.path).toBe("/Foo/Baz");

    data = await Controller.getTopicDataById("4_1");
    expect(data?.path).toBe("/Foo/Baz/Qux");
});

test("getTopicDataById gets correct nodes", async () => {
    let data = await Controller.getTopicDataById("1");
    expect(data?.parent).toBe(null);

    data = await Controller.getTopicDataById("2_1");
    expect(data?.parent?.name).toBe(RootTopicName);
    expect(data?.curr.name).toBe("Foo");

    data = await Controller.getTopicDataById("2_2");
    expect(data?.parent?.name).toBe(RootTopicName);
    expect(data?.curr.name).toBe("Bar");

    data = await Controller.getTopicDataById("3_1");
    expect(data?.parent?.name).toBe("Foo");
    expect(data?.curr.name).toBe("Baz");
});

test("getQuestionDataById gets correct questions", async () => {
    let question = await Controller.getQuestionDataById("q1");
    expect(question?.question).toBe("foobar-1");
    expect(question?.id).toBe("q1");

    question = await Controller.getQuestionDataById("q2");
    expect(question?.question).toBe("foobar-2");
    expect(question?.id).toBe("q2");
});

describe("Invalid ids return null", () => {
    test("invalid id", async () => {
        const data1 = await Controller.getTopicDataById("invalid_id");
        expect(data1).toBe(null);

        const question = await Controller.getQuestionDataById("invalid_id");
        expect(question).toBe(null);
    });

    test("getTopicDataById with Question id", async () => {
        const data = await Controller.getTopicDataById("q1");
        expect(data).toBe(null);
    });

    test("getQuestionDataById with Topic id", async () => {
        const data = await Controller.getQuestionDataById("1");
        expect(data).toBe(null);
    });
});
