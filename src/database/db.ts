import { DataBase } from "./DataBase.js";
import { TopicModel } from "../models/TopicModel.js";
import { RootTopicName } from "./DataBase.js";
import { QuestionModel } from "../models/QuestionModel.js";
import { ActiveDeck, SavedDeck } from "../models/DeckModel.js";

export type TopicData = {
    currentPath: string;
    currentTopic: TopicModel;
    parentTopic: TopicModel | null;
    rootTopic: TopicModel;
};

// Makes the entire structure indexable by id
export type IndexableFileData = {
    topics: { [id: string]: { parent: TopicModel | null; topic: TopicModel } };
    questions: { [id: string]: QuestionModel };
    root: TopicModel;
};

class Db {
    public async getTopicDataById(id: string): Promise<TopicData | null> {
        const indexableFileData = await DataBase.openTopics();

        const index = indexableFileData.topics[id];

        if (!index || !index.topic) {
            return null;
        }

        return {
            rootTopic: indexableFileData.root,
            currentTopic: index.topic,
            parentTopic: index.parent,
            currentPath: await this.getTopicPath(id, indexableFileData),
        };
    }

    public async getTopicPath(id: string, data?: IndexableFileData): Promise<string> {
        data = data ?? (await DataBase.openTopics());
        const path: string[] = [];

        let curr: TopicModel | null = data.topics[id]!.topic;
        while (curr) {
            path.push(curr.name);
            curr = data.topics[curr.id].parent;
        }

        if (path.length === 1) return "/";

        return path.reverse().join("/").replace(RootTopicName, "");
    }

    public async getIndexableFileData(): Promise<IndexableFileData> {
        const indexableFileData = await DataBase.openTopics();
        return indexableFileData;
    }

    public async getTopicById(id: string): Promise<TopicModel | null> {
        const indexableFileData = await DataBase.openTopics();
        const index = indexableFileData.topics[id];
        return index?.topic ?? null;
    }

    public async getParentTopicById(id: string): Promise<TopicModel | null> {
        const indexableFileData = await DataBase.openTopics();
        const index = indexableFileData.topics[id];
        return index?.parent ?? null;
    }

    public async getQuestionDataById(id: string): Promise<QuestionModel | null> {
        const indexableFileData = await DataBase.openTopics();
        const question = indexableFileData.questions[id];

        if (!question) {
            return null;
        }

        return question;
    }

    public async getManyQuestionsById(ids: string[]): Promise<QuestionModel[]> {
        const indexableFileData = await DataBase.openTopics();

        const questions = ids
            .map((id) => indexableFileData.questions[id])
            .filter((question) => question);

        return questions;
    }

    public async getActiveDeck(): Promise<ActiveDeck> {
        const decks = await DataBase.openDecks();
        return decks.active;
    }

    public async getSavedDeckById(id: string): Promise<SavedDeck | null> {
        const decks = await DataBase.openDecks();
        const saved = decks.saved;
        return saved.find((playlist) => playlist.id === id) ?? null;
    }

    public async getAllSavedDecks(): Promise<SavedDeck[]> {
        const decks = await DataBase.openDecks();
        return decks.saved;
    }

    public async saveDeck(toSave: SavedDeck): Promise<void> {
        const decks = await DataBase.openDecks();

        let versionExists = false;

        for (let i = 0; i < decks.saved.length; ++i) {
            const pl = decks.saved[i];
            if (pl.id === toSave.id) {
                versionExists = true;
                decks.saved[i] = toSave;
                break;
            }
        }

        if (!versionExists) {
            decks.saved.push(toSave);
        }

        await DataBase.saveDecks(decks);
    }

    public async saveActiveDeck(nextActiveDeck): Promise<void> {
        const decks = await DataBase.openDecks();
        decks.active = nextActiveDeck;
        await DataBase.saveDecks(decks);
    }
}

export const db = new Db();
