import fetch from "node-fetch";
import { BASE_URL } from "../root.js";
import { Topic } from "../server/model.js";
import { logger } from "phileas";

export default class TopicService {
    public static async getTopic(topicID: string): Promise<Topic> {
        const response = await fetch(`${BASE_URL}/topics/${topicID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(String(response.status));
        }

        return (await response.json()) as Topic;
    }

    public static async postTopic(
        topicID: string,
        topicName: string,
    ): Promise<Topic> {
        const response = await fetch(
            `${BASE_URL}/topics/${topicID}/topics/${topicName}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            },
        );

        if (!response.ok) {
            throw new Error(String(response.status));
        }

        return (await response.json()) as Topic;
    }
}
