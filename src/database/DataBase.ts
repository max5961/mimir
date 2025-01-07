import fs from "fs/promises";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { randomUUID } from "crypto";
import { TopicsPath, DataBaseDir, NodeEnv, PlaylistsPath } from "../env/Env.js";
import { TopicModel } from "../models/TopicModel.js";
import { IndexableFileData } from "./IndexableFileData.js";
import { sampleRoot } from "../models/sampleTopicModel.js";
import { Playlists } from "../models/PlaylistsModel.js";
import { samplePlaylists } from "../models/samplePlaylistModel.js";

export const RootTopicName = "$$ROOT";

export class DataBase {
    static topicsPath = TopicsPath;
    static playlistsPath = PlaylistsPath;

    /*
     * Reads the json file (Topic) and converts it into a TopicIndexModel object
     * */
    public static async openTopics(): Promise<IndexableFileData> {
        const contents = await fs.readFile(TopicsPath, { encoding: "utf-8" });
        const root = JSON.parse(contents) as TopicModel;

        const buildIndex = (
            root: TopicModel,
            index: IndexableFileData = { topics: {}, questions: {}, root: root },
        ) => {
            if (!index.topics[root.id]) {
                index.topics[root.id] = { parent: null, topic: root };
            }

            root.questions.forEach((question) => {
                index.questions[question.id] = question;
            });

            root.subTopics.forEach((subTopic) => {
                index.topics[subTopic.id] = { topic: subTopic, parent: root };
                buildIndex(subTopic, index);
            });

            return index;
        };

        return buildIndex(root);
    }

    /*
     * Save just the root.  The indexed tree isn't written.
     * */
    public static async saveTopics(root: TopicModel): Promise<void> {
        const data = JSON.stringify(root, null, 4);
        return await fs.writeFile(TopicsPath, data, { encoding: "utf-8" });
    }

    public static async openPlaylists(): Promise<Playlists> {
        const data = await fs.readFile(PlaylistsPath, { encoding: "utf-8" });
        return JSON.parse(data) as Playlists;
    }

    public static async savePlaylists(playlists: Playlists): Promise<void> {
        const json = JSON.stringify(playlists);
        await fs.writeFile(PlaylistsPath, json, { encoding: "utf-8" });
    }

    /*
     * Synchronously gets a pointer to the root so that we have data before the
     * app first renders
     * */
    public static getRootTopicSync(): TopicModel {
        const json = readFileSync(TopicsPath, { encoding: "utf-8" });
        const root = JSON.parse(json) as TopicModel;
        return root;
    }

    /*
     * Synchronously gets a pointer to the playlists data for first render
     * */
    public static getPlaylistsSync(): Playlists {
        const json = readFileSync(PlaylistsPath, { encoding: "utf-8" });
        return JSON.parse(json) as Playlists;
    }

    /*
     * Checks for/creates a json file to read and write data from.  Handles environment
     * variables
     * */
    public static initializeDataBaseSync(): void {
        mkdirSync(DataBaseDir, { recursive: true });

        const rootTopic: TopicModel = {
            id: randomUUID(),
            name: RootTopicName,
            questions: [],
            subTopics: [],
        };

        const topicFileExists = existsSync(TopicsPath);

        if (!topicFileExists) {
            writeFileSync(TopicsPath, JSON.stringify(rootTopic), {
                encoding: "utf-8",
            });
        }

        if (NodeEnv === "development") {
            writeFileSync(TopicsPath, JSON.stringify(sampleRoot), {
                encoding: "utf-8",
            });
            writeFileSync(PlaylistsPath, JSON.stringify(samplePlaylists), {
                encoding: "utf-8",
            });
        }
    }
}
