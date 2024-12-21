type MultipleChoiceAnswer = "A" | "B" | "C" | "D";

export type MultipleChoice = {
    question: string;
    answer: MultipleChoiceAnswer | Lowercase<MultipleChoiceAnswer>;
    A?: string;
    B?: string;
    C?: string;
    D?: string;
};

export type QuestionAnswer = {
    question: string;
    answer: string;

    // For type conflicts
    A?: string;
    B?: string;
    C?: string;
    D?: string;
};

export type Question<T extends "qa" | "qi" | "mc"> = T extends "mc"
    ? MultipleChoice & { type: T; id: string }
    : QuestionAnswer & { type: T; id: string };

export type AnyQuestionType = Question<"mc"> | Question<"qa"> | Question<"qi">;

export type PageData = {
    questions: AnyQuestionType[];
    topics: string[];
};

export type Topic = {
    id: string;
    name: string;
    questions: AnyQuestionType[];
    topics: Topic[];
};

export type TreeIndex = {
    // Pointers to all the IDs in the object
    pointers: {
        topics: { [id: string]: Topic };
        questions: { [id: string]: AnyQuestionType };
    };

    // Pointer to just the root object
    root: Topic[];
};

const root: Topic[] = [
    {
        id: "123",
        name: "root",
        questions: [
            {
                id: "123",
                type: "qa",
                question: "What is foo + bar?",
                answer: "foobar",
            },
            {
                id: "123",
                type: "qa",
                question: "What is foo + bar?",
                answer: "foobar",
            },
        ],
        topics: [{ id: "456", name: "stem", questions: [], topics: [] }],
    },
];
