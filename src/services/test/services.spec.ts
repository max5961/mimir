import { test, describe, expect } from "vitest";
import { DataBase, RootTopicName } from "../../database/DataBase.js";
import TopicService from "../TopicService.js";
import QuestionService from "../QuestionService.js";

DataBase.initializeDataBase();
DataBase.saveDb({
    id: "1",
    name: RootTopicName,
    questions: [],
    subTopics: [
        {
            id: "2_1",
            name: "Foo",
            questions: [
                { id: "q1", type: "qa", question: "foobar-1", answer: "bazqux-1" },
                { id: "q2", type: "qa", question: "foobar-2", answer: "bazqux-2" },
            ],
            subTopics: [
                {
                    id: "3_1",
                    name: "Baz",
                    questions: [],
                    subTopics: [{ id: "4_1", name: "Qux", questions: [], subTopics: [] }],
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

describe("TopicService.getTopicDataById", () => {
    test("1", async () => {
        const data = await TopicService.getTopicDataById("1");
        expect(data?.currentTopic.name).toBe(RootTopicName);
    });

    test("2_1", async () => {
        const data = await TopicService.getTopicDataById("2_1");
        expect(data?.currentTopic.name).toBe("Foo");
    });

    test("2_2", async () => {
        const data = await TopicService.getTopicDataById("2_2");
        expect(data?.currentTopic.name).toBe("Bar");
    });

    test("3_1", async () => {
        const data = await TopicService.getTopicDataById("3_1");
        expect(data?.currentTopic.name).toBe("Baz");
    });
});

describe("TopicService.getTopicById", () => {
    test("1", async () => {
        const data = await TopicService.getTopicById("1");
        expect(data?.name).toBe(RootTopicName);
    });

    test("2_1", async () => {
        const data = await TopicService.getTopicById("2_1");
        expect(data?.name).toBe("Foo");
    });

    test("2_2", async () => {
        const data = await TopicService.getTopicById("2_2");
        expect(data?.name).toBe("Bar");
    });

    test("3_1", async () => {
        const data = await TopicService.getTopicById("3_1");
        expect(data?.name).toBe("Baz");
    });
});

describe("TopicService.getParentTopicById", () => {
    test("1", async () => {
        const parent = await TopicService.getParentTopicById("1");
        expect(parent).toBe(null);
    });

    test("2_1", async () => {
        const parent = await TopicService.getParentTopicById("2_1");
        expect(parent?.name).toBe(RootTopicName);
    });

    test("3_1", async () => {
        const parent = await TopicService.getParentTopicById("3_1");
        expect(parent?.name).toBe("Foo");
    });
});

describe("Reading data gets correct topic path", () => {
    test("/", async () => {
        const data = await TopicService.getTopicDataById("1");
        expect(data?.currentPath).toBe("/");
    });

    test("/Foo", async () => {
        const data = await TopicService.getTopicDataById("2_1");
        expect(data?.currentPath).toBe("/Foo");
    });

    test("/Bar", async () => {
        const data = await TopicService.getTopicDataById("2_2");
        expect(data?.currentPath).toBe("/Bar");
    });

    test("/Foo/Baz", async () => {
        const data = await TopicService.getTopicDataById("3_1");
        expect(data?.currentPath).toBe("/Foo/Baz");
    });

    test("/Foo/Baz/Qux", async () => {
        const data = await TopicService.getTopicDataById("4_1");
        expect(data?.currentPath).toBe("/Foo/Baz/Qux");
    });
});

test("TopicService.getTopicDataById gets correct nodes", async () => {
    let data = await TopicService.getTopicDataById("1");
    expect(data?.parentTopic).toBe(null);

    data = await TopicService.getTopicDataById("2_1");
    expect(data?.parentTopic?.name).toBe(RootTopicName);
    expect(data?.currentTopic.name).toBe("Foo");

    data = await TopicService.getTopicDataById("2_2");
    expect(data?.parentTopic?.name).toBe(RootTopicName);
    expect(data?.currentTopic.name).toBe("Bar");

    data = await TopicService.getTopicDataById("3_1");
    expect(data?.parentTopic?.name).toBe("Foo");
    expect(data?.currentTopic.name).toBe("Baz");
});

test("QuestionService.getQuestionDataById gets correct questions", async () => {
    let question = await QuestionService.getQuestionDataById("q1");
    expect(question?.question).toBe("foobar-1");
    expect(question?.id).toBe("q1");

    question = await QuestionService.getQuestionDataById("q2");
    expect(question?.question).toBe("foobar-2");
    expect(question?.id).toBe("q2");
});

describe("Invalid ids return null", () => {
    test("invalid id", async () => {
        const data1 = await TopicService.getTopicDataById("invalid_id");
        expect(data1).toBe(null);

        const question = await QuestionService.getQuestionDataById("invalid_id");
        expect(question).toBe(null);
    });

    test("getTopicDataById with Question id", async () => {
        const data = await TopicService.getTopicDataById("q1");
        expect(data).toBe(null);
    });

    test("getQuestionDataById with Topic id", async () => {
        const data = await QuestionService.getQuestionDataById("1");
        expect(data).toBe(null);
    });
});
