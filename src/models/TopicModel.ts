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

    // These will never be assigned, but exist only so that this type can be combined
    // with MultipleChoice
    A?: string;
    B?: string;
    C?: string;
    D?: string;
};

export type GenericQuestion<T extends "qa" | "qi" | "mc"> = T extends "mc"
    ? MultipleChoice & { type: T; id: string }
    : QuestionAnswer & { type: T; id: string };

export type Question =
    | GenericQuestion<"mc">
    | GenericQuestion<"qa">
    | GenericQuestion<"qi">;

export type Topic = {
    id: string;
    name: string;
    questions: Question[];
    topics: Topic[];
};

// Makes the entire structure indexable by id
export type TopicIndex = {
    topics: { [id: string]: { parent: Topic | null; topic: Topic } };
    questions: { [id: string]: Question };
    root: Topic;
};

export const sampleRoot: Topic = {
    id: "0",
    name: "$$ROOT",
    questions: [
        {
            id: "rq1",
            type: "qa",
            question: "What is the smallest planet in our solar system?",
            answer: "Mercury",
        },
        {
            id: "rq2",
            type: "mc",
            question: "Which element is represented by the symbol 'Na'?",
            answer: "A",
            A: "Sodium",
            B: "Nitrogen",
            C: "Neon",
            D: "Nickel",
        },
        {
            id: "rq3",
            type: "qa",
            question: "What is the hardest known natural material?",
            answer: "Diamond",
        },
        {
            id: "rq4",
            type: "mc",
            question: "Which gas makes up most of Earth's atmosphere?",
            answer: "B",
            A: "Oxygen",
            B: "Nitrogen",
            C: "Carbon Dioxide",
            D: "Helium",
        },
        {
            id: "rq5",
            type: "qi",
            question: "Who invented the light bulb?",
            answer: "Thomas Edison",
        },
        {
            id: "rq6",
            type: "qi",
            question: "Which planet is known as the Morning Star?",
            answer: "Venus",
        },
        {
            id: "rq7",
            type: "mc",
            question: "What is the most abundant gas in the sun?",
            answer: "A",
            A: "Hydrogen",
            B: "Oxygen",
            C: "Carbon",
            D: "Nitrogen",
        },
        {
            id: "rq8",
            type: "qa",
            question: "How many bones are there in the adult human body?",
            answer: "206",
        },
        {
            id: "rq9",
            type: "mc",
            question: "Which country was first to land on the moon?",
            answer: "B",
            A: "Russia",
            B: "USA",
            C: "China",
            D: "India",
        },
        {
            id: "rq10",
            type: "qa",
            question: "What is the largest organ in the human body?",
            answer: "Skin",
        },
    ],
    topics: [
        {
            id: "1",
            name: "Science",
            questions: [
                {
                    id: "sci1",
                    type: "qa",
                    question: "What is the chemical symbol for potassium?",
                    answer: "K",
                },
                {
                    id: "sci2",
                    type: "mc",
                    question: "Which gas do plants need for photosynthesis?",
                    answer: "C",
                    A: "Oxygen",
                    B: "Hydrogen",
                    C: "Carbon Dioxide",
                    D: "Methane",
                },
            ],
            topics: [
                {
                    id: "1_1",
                    name: "Physics",
                    questions: [
                        {
                            id: "phy1",
                            type: "qa",
                            question: "Who formulated the laws of motion?",
                            answer: "Isaac Newton",
                        },
                        {
                            id: "phy2",
                            type: "mc",
                            question: "What is the unit of electrical resistance?",
                            answer: "B",
                            A: "Joule",
                            B: "Ohm",
                            C: "Watt",
                            D: "Volt",
                        },
                    ],
                    topics: [],
                },
                {
                    id: "1_2",
                    name: "Biology",
                    questions: [
                        {
                            id: "bio1",
                            type: "qa",
                            question: "What is the powerhouse of the cell?",
                            answer: "Mitochondria",
                        },
                        {
                            id: "bio2",
                            type: "mc",
                            question: "Which part of the plant conducts photosynthesis?",
                            answer: "D",
                            A: "Root",
                            B: "Stem",
                            C: "Flower",
                            D: "Leaf",
                        },
                    ],
                    topics: [],
                },
            ],
        },
        {
            id: "2",
            name: "History",
            questions: [
                {
                    id: "hist1",
                    type: "qa",
                    question: "Who was the first emperor of Rome?",
                    answer: "Augustus",
                },
                {
                    id: "hist2",
                    type: "mc",
                    question: "Which year did World War I start?",
                    answer: "A",
                    A: "1914",
                    B: "1939",
                    C: "1812",
                    D: "1865",
                },
            ],
            topics: [
                {
                    id: "2_1",
                    name: "Ancient Civilizations",
                    questions: [
                        {
                            id: "anc1",
                            type: "qa",
                            question: "Which civilization built Machu Picchu?",
                            answer: "Inca",
                        },
                        {
                            id: "anc2",
                            type: "mc",
                            question: "Where did the first Olympic Games take place?",
                            answer: "B",
                            A: "Rome",
                            B: "Greece",
                            C: "Egypt",
                            D: "Persia",
                        },
                    ],
                    topics: [],
                },
            ],
        },
        {
            id: "3",
            name: "Mathematics",
            questions: [
                {
                    id: "math1",
                    type: "qa",
                    question: "What is the value of π (pi) to two decimal places?",
                    answer: "3.14",
                },
                {
                    id: "math2",
                    type: "mc",
                    question: "What is 12 squared?",
                    answer: "C",
                    A: "124",
                    B: "112",
                    C: "144",
                    D: "132",
                },
            ],
            topics: [
                {
                    id: "3_1",
                    name: "Geometry",
                    questions: [
                        {
                            id: "geo1",
                            type: "qa",
                            question: "How many sides does a heptagon have?",
                            answer: "7",
                        },
                        {
                            id: "geo2",
                            type: "mc",
                            question: "What is the formula for the area of a circle?",
                            answer: "A",
                            A: "πr²",
                            B: "2πr",
                            C: "πd",
                            D: "r²",
                        },
                    ],
                    topics: [],
                },
            ],
        },
    ],
};
