import { TopicModel } from "./TopicModel.js";

export const sampleRoot: TopicModel = {
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
            multipleChoiceAnswer: "1",
            a: { id: "1", value: "Sodium" },
            b: { id: "2", value: "Nitrogen" },
            c: { id: "3", value: "Neon" },
            d: { id: "4", value: "Nickel" },
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
            multipleChoiceAnswer: "2",
            a: { id: "1", value: "Oxygen" },
            b: { id: "2", value: "Nitrogen" },
            c: { id: "3", value: "Carbon Dioxide" },
            d: { id: "4", value: "Helium" },
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
            multipleChoiceAnswer: "1",
            a: { id: "1", value: "Hydrogen" },
            b: { id: "2", value: "Oxygen" },
            c: { id: "3", value: "Carbon" },
            d: { id: "4", value: "Nitrogen" },
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
            multipleChoiceAnswer: "2",
            a: { id: "1", value: "Russia" },
            b: { id: "2", value: "USA" },
            c: { id: "3", value: "China" },
            d: { id: "4", value: "India" },
        },
        {
            id: "rq10",
            type: "qa",
            question: "What is the largest organ in the human body?",
            answer: "Skin",
        },
    ],
    subTopics: [
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
                    multipleChoiceAnswer: "3",
                    a: { id: "1", value: "Oxygen" },
                    b: { id: "2", value: "Hydrogen" },
                    c: { id: "3", value: "Carbon Dioxide" },
                    d: { id: "4", value: "Methane" },
                },
            ],
            subTopics: [
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
                            multipleChoiceAnswer: "2",
                            a: { id: "1", value: "Joule" },
                            b: { id: "2", value: "Ohm" },
                            c: { id: "3", value: "Watt" },
                            d: { id: "4", value: "Volt" },
                        },
                    ],
                    subTopics: [],
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
                            multipleChoiceAnswer: "4",
                            a: { id: "1", value: "Root" },
                            b: { id: "2", value: "Stem" },
                            c: { id: "3", value: "Flower" },
                            d: { id: "4", value: "Leaf" },
                        },
                    ],
                    subTopics: [],
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
                    multipleChoiceAnswer: "1",
                    a: { id: "1", value: "1914" },
                    b: { id: "2", value: "1939" },
                    c: { id: "3", value: "1812" },
                    d: { id: "4", value: "1865" },
                },
            ],
            subTopics: [
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
                            multipleChoiceAnswer: "2",
                            a: { id: "1", value: "Rome" },
                            b: { id: "2", value: "Greece" },
                            c: { id: "3", value: "Egypt" },
                            d: { id: "4", value: "Persia" },
                        },
                    ],
                    subTopics: [],
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
                    multipleChoiceAnswer: "3",
                    a: { id: "1", value: "124" },
                    b: { id: "2", value: "112" },
                    c: { id: "3", value: "144" },
                    d: { id: "4", value: "132" },
                },
            ],
            subTopics: [
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
                            answer: "1",
                            a: { id: "1", value: "πr²" },
                            b: { id: "2", value: "2πr" },
                            c: { id: "3", value: "πd" },
                            d: { id: "4", value: "r²" },
                        },
                    ],
                    subTopics: [],
                },
            ],
        },
    ],
};
