import fetch from "node-fetch";
import { BaseURL } from "../root.js";
import { Data } from "../routes/topics/topicsController.js";

export default class TopicService {
    public static async getTopic(topicID: string) {
        const response = await fetch(`${BaseURL}/topics/${topicID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            return response.status;
        }

        return (await response.json()) as Data;
    }

    public static async postTopic(topicID: string, topicName: string) {
        const response = await fetch(`${BaseURL}/topics/${topicID}/topics/${topicName}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            return response.status;
        }

        return (await response.json()) as Data;
    }
}
