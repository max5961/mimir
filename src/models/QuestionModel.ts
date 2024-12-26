type MultipleChoiceAnswer = "A" | "B" | "C" | "D";

type MultipleChoice = {
    question: string;
    answer: MultipleChoiceAnswer | Lowercase<MultipleChoiceAnswer>;
    A?: string;
    B?: string;
    C?: string;
    D?: string;
};

type QuestionAnswer = {
    question: string;
    answer: string;

    // These will never be assigned, but exist only so that this type can be combined
    // with MultipleChoice
    A?: string;
    B?: string;
    C?: string;
    D?: string;
};

type GenericQuestion<T extends "qa" | "qi" | "mc"> = T extends "mc"
    ? MultipleChoice & { type: T; id: string }
    : QuestionAnswer & { type: T; id: string };

export type QuestionModel =
    | GenericQuestion<"mc">
    | GenericQuestion<"qa">
    | GenericQuestion<"qi">;
