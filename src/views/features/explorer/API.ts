import { BaseURL } from "../../../root.js";
import { TopicResponse } from "../../../routes/topics/topicsController.js";

async function getTopicData(topicID: string): Promise<TopicResponse.GetTopicData> {
    const response = await fetch(`${BaseURL}/api/topics/data/${topicID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return await response.json();
}

async function postTopics(
    topicID: string,
    newTopicNames: string[],
): Promise<TopicResponse.PostTopics> {
    const response = await fetch(`${BaseURL}/api/topics/${topicID}/subtopics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTopicNames }),
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return await response.json();
}

async function moveTopic(
    topicID: string,
    targetID: string,
    destination: string,
): Promise<TopicResponse.MoveTopic> {
    const response = await fetch(`${BaseURL}/api/topics/move/${topicID}/${targetID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return await response.json();
}

export default {
    getTopicData,
    postTopics,
    moveTopic,
};
