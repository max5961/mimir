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
};

export type Question<T extends "qa" | "qi" | "mc"> = T extends "mc"
    ? MultipleChoice & { type: T; id: string }
    : QuestionAnswer & { type: T; id: string };

export type AnyQuestionType = Question<"mc"> | Question<"qa"> | Question<"qi">;

export type Topic = {
    [key: string]: AnyQuestionType[] | Topic;
};

export type PageData = {
    questions: AnyQuestionType[];
    topics: string[];
};

export const QUESTIONS_ARRAY = "$$questions";

const root: Topic = {
    //
};
