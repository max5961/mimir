import { BaseURL } from "../../../root.js";
import { TopicsData } from "../../../routes/topics/topicsController.js";

async function getTopic(topicID: string): Promise<TopicsData> {
    const response = await fetch(`${BaseURL}/topics/${topicID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return (await response.json()) as TopicsData;
}

export default {
    getTopic,
};
