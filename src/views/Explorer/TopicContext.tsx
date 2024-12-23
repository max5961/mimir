import React from "react";

type TopicContext = {
    topic: any;
};

export const TopicContext = React.createContext<TopicContext | null>(null);

export function useTopicContext(): TopicContext {
    const ctx = React.useContext(TopicContext);
    if (!ctx) {
        throw new Error(
            "Using TopicContext outside the scope of a TopicContext.Provider",
        );
    }
    return ctx;
}
