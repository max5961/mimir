type MultipleChoiceAnswer = "A" | "B" | "C" | "D";

export type MultipleChoiceOpt = { id: string; value: string };

export type MultipleChoice = {
    id: string;
    question: string;
    answer?: string;
    multipleChoiceAnswer?: MultipleChoiceAnswer;
    a?: MultipleChoiceOpt;
    b?: MultipleChoiceOpt;
    c?: MultipleChoiceOpt;
    d?: MultipleChoiceOpt;
};

export type QuestionAnswer = {
    id: string;
    question: string;
    answer?: string;

    // These will never be assigned, but exist only so that this type can be combined
    // with MultipleChoice
    multipleChoiceAnswer?: MultipleChoiceAnswer;
    a?: MultipleChoiceOpt;
    b?: MultipleChoiceOpt;
    c?: MultipleChoiceOpt;
    d?: MultipleChoiceOpt;
};

export type GenericQuestion<T extends "qa" | "qi" | "mc"> = T extends "mc"
    ? MultipleChoice & { type: T }
    : QuestionAnswer & { type: T };

export type QuestionModel =
    | GenericQuestion<"mc">
    | GenericQuestion<"qa">
    | GenericQuestion<"qi">;
