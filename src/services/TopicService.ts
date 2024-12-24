import fetch from "node-fetch";
import { BaseURL } from "../root.js";
import { TopicsData } from "../routes/topics/topicsController.js";

async function getTopic(topicID: string) {
    const response = await fetch(`${BaseURL}/topics/${topicID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        return response.status;
    }

    return (await response.json()) as TopicsData;
}

async function postTopic(topicID: string, topicName: string) {
    const response = await fetch(`${BaseURL}/topics/${topicID}/topics/${topicName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        return response.status;
    }

    return (await response.json()) as TopicsData;
}

export default {
    getTopic,
    postTopic,
};
