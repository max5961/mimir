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

export const sampleRoot: Topic[] = [
    {
        id: "0",
        name: "$$ROOT",
        questions: [
            {
                id: "rq1",
                type: "qa",
                question: "What is the tallest mountain in the world?",
                answer: "Mount Everest",
            },
            {
                id: "rq2",
                type: "mc",
                question: "Which planet is known as the Red Planet?",
                answer: "B",
                A: "Venus",
                B: "Mars",
                C: "Jupiter",
                D: "Saturn",
            },
            {
                id: "rq3",
                type: "qa",
                question: "What is the square root of 144?",
                answer: "12",
            },
        ],
        topics: [
            {
                id: "1",
                name: "General Knowledge",
                questions: [
                    {
                        id: "q1",
                        type: "qa",
                        question: "What is the capital of Japan?",
                        answer: "Tokyo",
                    },
                    {
                        id: "q2",
                        type: "mc",
                        question: "Which of these is NOT a primary color?",
                        answer: "D",
                        A: "Red",
                        B: "Blue",
                        C: "Yellow",
                        D: "Green",
                    },
                ],
                topics: [
                    {
                        id: "2",
                        name: "Science",
                        questions: [
                            {
                                id: "q3",
                                type: "qa",
                                question:
                                    "What is the chemical symbol for water?",
                                answer: "H2O",
                            },
                            {
                                id: "q4",
                                type: "mc",
                                question: "Which of these is a noble gas?",
                                answer: "C",
                                A: "Oxygen",
                                B: "Nitrogen",
                                C: "Neon",
                                D: "Hydrogen",
                            },
                        ],
                        topics: [
                            {
                                id: "3",
                                name: "Physics",
                                questions: [
                                    {
                                        id: "q5",
                                        type: "mc",
                                        question: "What is the speed of light?",
                                        answer: "A",
                                        A: "299,792 km/s",
                                        B: "150,000 km/s",
                                        C: "3,000 km/s",
                                        D: "1,000 km/s",
                                    },
                                    {
                                        id: "q6",
                                        type: "qa",
                                        question:
                                            "Who developed the theory of relativity?",
                                        answer: "Albert Einstein",
                                    },
                                ],
                                topics: [],
                            },
                        ],
                    },
                ],
            },
            {
                id: "4",
                name: "History",
                questions: [
                    {
                        id: "hq1",
                        type: "qa",
                        question: "Who wrote the Declaration of Independence?",
                        answer: "Thomas Jefferson",
                    },
                    {
                        id: "hq2",
                        type: "mc",
                        question: "In what year did World War II end?",
                        answer: "B",
                        A: "1942",
                        B: "1945",
                        C: "1950",
                        D: "1939",
                    },
                ],
                topics: [
                    {
                        id: "5",
                        name: "Ancient Civilizations",
                        questions: [
                            {
                                id: "hq3",
                                type: "qa",
                                question:
                                    "Which civilization built the pyramids?",
                                answer: "The Egyptians",
                            },
                        ],
                        topics: [
                            {
                                id: "6",
                                name: "Mayan Empire",
                                questions: [
                                    {
                                        id: "hq4",
                                        type: "mc",
                                        question:
                                            "Which calendar did the Mayans use?",
                                        answer: "A",
                                        A: "Long Count",
                                        B: "Gregorian",
                                        C: "Lunar",
                                        D: "Julian",
                                    },
                                ],
                                topics: [],
                            },
                        ],
                    },
                ],
            },
            {
                id: "7",
                name: "Mathematics",
                questions: [
                    {
                        id: "mq1",
                        type: "qa",
                        question: "What is 8 x 7?",
                        answer: "56",
                    },
                    {
                        id: "mq2",
                        type: "mc",
                        question: "Which of these is a prime number?",
                        answer: "C",
                        A: "4",
                        B: "9",
                        C: "11",
                        D: "15",
                    },
                    {
                        id: "mq3",
                        type: "qa",
                        question: "Solve for x: 2x + 6 = 14",
                        answer: "x = 4",
                    },
                ],
                topics: [
                    {
                        id: "8",
                        name: "Geometry",
                        questions: [
                            {
                                id: "mq4",
                                type: "qa",
                                question: "How many sides does a hexagon have?",
                                answer: "6",
                            },
                            {
                                id: "mq5",
                                type: "mc",
                                question: "Which shape has the most sides?",
                                answer: "B",
                                A: "Triangle",
                                B: "Decagon",
                                C: "Pentagon",
                                D: "Square",
                            },
                        ],
                        topics: [],
                    },
                ],
            },
        ],
    },
    {
        id: "9",
        name: "Technology",
        questions: [
            {
                id: "tq1",
                type: "qa",
                question: "Who founded Microsoft?",
                answer: "Bill Gates",
            },
            {
                id: "tq2",
                type: "mc",
                question: "What does 'CPU' stand for?",
                answer: "A",
                A: "Central Processing Unit",
                B: "Computer Power Unit",
                C: "Core Power Unit",
                D: "Central Protocol Unit",
            },
        ],
        topics: [
            {
                id: "10",
                name: "Programming",
                questions: [
                    {
                        id: "tq3",
                        type: "qa",
                        question: "Which language is used to build websites?",
                        answer: "HTML",
                    },
                    {
                        id: "tq4",
                        type: "mc",
                        question: "What is a boolean value?",
                        answer: "B",
                        A: "String",
                        B: "True/False",
                        C: "Integer",
                        D: "Array",
                    },
                ],
                topics: [],
            },
        ],
    },
];
