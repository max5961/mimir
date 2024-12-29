type MultipleChoiceAnswer = "A" | "B" | "C" | "D";

export type MultipleChoice = {
    id: string;
    question: string;
    answer: MultipleChoiceAnswer | Lowercase<MultipleChoiceAnswer>;
    A?: string;
    B?: string;
    C?: string;
    D?: string;
};

export type QuestionAnswer = {
    id: string;
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
    ? MultipleChoice & { type: T }
    : QuestionAnswer & { type: T };

export type QuestionModel =
    | GenericQuestion<"mc">
    | GenericQuestion<"qa">
    | GenericQuestion<"qi">;
