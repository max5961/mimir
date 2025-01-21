import { DataBase } from "./DataBase.js";
import { TopicModel } from "../models/TopicModel.js";
import { RootTopicName } from "./DataBase.js";
import { QuestionModel } from "../models/QuestionModel.js";
import { ActiveDeck, SavedDeck, SavedDeckStore } from "../models/DeckModel.js";
import { randomUUID } from "crypto";
import { logger } from "tuir";

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

    // Decks

    public async getActiveDeck(): Promise<ActiveDeck> {
        const decks = await DataBase.openDecks();
        return decks.active;
    }

    public async putActiveDeck(nextActiveDeck: ActiveDeck): Promise<void> {
        const decks = await DataBase.openDecks();
        decks.active = nextActiveDeck;
        await DataBase.saveDecks(decks);
    }

    public async getSavedDeckById(id: string): Promise<SavedDeck | null> {
        const decks = await DataBase.openDecks();
        const saved = decks.saved;
        return saved[id] ?? null;
    }

    public async getSavedDeckByName(name: string): Promise<SavedDeck | null> {
        const decks = await DataBase.openDecks();
        return Object.values(decks.saved).find((deck) => deck.name === name) ?? null;
    }

    public async getAllSavedDecks(): Promise<SavedDeckStore> {
        const decks = await DataBase.openDecks();
        return decks.saved;
    }

    public async deckNameExists(deck: SavedDeck): Promise<boolean> {
        const decks = await DataBase.openDecks();
        return Object.values(decks.saved).some((d) => {
            if (d.id === deck.id) return false;
            return d.name === deck.name;
        });
    }

    public async getIdToOverwriteSavedDeck(deck: SavedDeck): Promise<null | string> {
        const decks = await DataBase.openDecks();
        for (const saved of Object.values(decks.saved)) {
            if (saved.name === deck.name) {
                return saved.id;
            }
        }
        return null;
    }

    public async updateSavedDeck(deck: SavedDeck): Promise<boolean> {
        const decks = await DataBase.openDecks();

        if (await this.deckNameExists(deck)) return false;

        decks.saved[deck.id] = deck;
        await DataBase.saveDecks(decks);

        return true;
    }

    public async saveNewDeck(deck: SavedDeck): Promise<boolean> {
        if (await this.deckNameExists(deck)) return false;

        const decks = await DataBase.openDecks();
        decks.saved[deck.id] = deck;
        await DataBase.saveDecks(decks);

        return true;
    }

    public async saveDeck(deck: SavedDeck): Promise<void> {
        const decks = await DataBase.openDecks();

        if (await this.deckNameExists(deck)) {
            const id = await this.getIdToOverwriteSavedDeck(deck);
            if (id) {
                decks.saved[id] = { ...deck, id: id };
                await DataBase.saveDecks(decks);
                return;
            }
        }

        decks.saved[deck.id] = deck;
        await DataBase.saveDecks(decks);
    }

    public async saveAllSavedDecks(saved: SavedDeckStore): Promise<void> {
        const decks = await DataBase.openDecks();
        decks.saved = saved;
        await DataBase.saveDecks(decks);
    }
}

export const db = new Db();
