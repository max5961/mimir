import express from "express";
import { db } from "../../database/db.js";
import { ActiveDeck, QuizQuestion, SavedDeck } from "../../models/DeckModel.js";
import { TopicModel } from "../../models/TopicModel.js";
import { randomUUID } from "crypto";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

export class Controller {
    public static async getActiveDeck(req: Req, res: Res, next: Next) {
        const activeDeck = await db.getActiveDeck();
        res.status(200).json(activeDeck);
    }

    public static async putActiveDeck(req: Req, res: Res, next: Next) {
        const nextActiveDeck = req.body.activeDeck as ActiveDeck;
        await db.putActiveDeck(nextActiveDeck);
        res.status(200).json(nextActiveDeck);
    }

    public static async postQuestionToActiveDeck(req: Req, res: Res, next: Next) {
        const question = req.body.question as QuizQuestion;

        if (!question.question || !question.id || !question.type || !question.path) {
            res.status(400).json({ error: "Invalid request format" });
            return;
        }

        const deck = await db.getActiveDeck();
        if (!deck.some((q) => q.id === question.id)) {
            deck.push(question);
            await db.putActiveDeck(deck);
        }
        res.status(200).json(deck);
    }

    public static async postTopicToActiveDeck(req: Req, res: Res, next: Next) {
        const id = req.params.id;

        const topic = await db.getTopicById(id);

        if (!topic) {
            res.status(404).json({ error: "Topic does not exist" });
            return;
        }

        const activeDeck = await db.getActiveDeck();
        const push = async (topic: TopicModel) => {
            const path = await db.getTopicPath(topic.id);

            topic.questions.forEach((question) => {
                if (!activeDeck.some((q) => q.id === question.id)) {
                    activeDeck.push({ ...question, path });
                }
            });

            topic.subTopics.forEach(async (subTopic) => {
                await push(subTopic);
            });
        };

        await push(topic);

        await db.putActiveDeck(activeDeck);
        res.status(200).json(activeDeck);
    }

    public static async deleteQuestion(req: Req, res: Res, next: Next) {
        const id = req.params.id;
        const deck = await db.getActiveDeck();
        const idx = deck.findIndex((q) => q.id === id);

        if (idx === -1) {
            res.status(404).json({ error: `Cannot find question with id: ${id}` });
            return;
        }

        deck.splice(idx, 1);
        await db.putActiveDeck(deck);
        res.status(200).json(deck);
    }

    public static async clearActiveDeck(req: Req, res: Res) {
        await db.putActiveDeck([]);
        res.status(200).json([]);
    }

    public static async saveActiveDeckAs(req: Req, res: Res) {
        const activeDeck = req.body.activeDeck as ActiveDeck;
        const name = req.params.name;

        const newDeck: SavedDeck = {
            id: randomUUID(),
            name,
            deck: activeDeck,
        };

        await db.saveDeck(newDeck);

        const savedDeckStore = await db.getAllSavedDecks();

        res.status(200).json(savedDeckStore);
    }

    public static async getSavedDecks(req: Req, res: Res) {
        const savedDeckStore = await db.getAllSavedDecks();
        res.status(200).json(savedDeckStore);
    }

    public static async deleteSavedDeck(req: Req, res: Res) {
        const id = req.params.id;
        const decks = await db.getAllSavedDecks();

        if (!decks[id]) {
            res.status(404).json({ error: `Cannot find saved deck with id: ${id}` });
            return;
        }

        delete decks[id];
        await db.saveAllSavedDecks(decks);
        res.status(200).json(decks);
    }

    public static async postToSavedFromActiveDeck(req: Req, res: Res) {
        const targetID = req.params.targetID;
        const activeDeck = req.body.activeDeck as ActiveDeck;

        const decks = await db.getAllSavedDecks();

        if (!decks[targetID]) {
            res.status(404).json({
                error: `Cannot find saved deck with id: ${targetID}`,
            });
            return;
        }

        const targetDeck = decks[targetID];

        activeDeck.forEach((question) => {
            if (!targetDeck.deck.some((q) => q.id === question.id)) {
                targetDeck.deck.push(question);
            }
        });

        await db.saveAllSavedDecks(decks);
        res.status(200).json(decks);
    }
}
