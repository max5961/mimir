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
        await db.updateActiveDeck(nextActiveDeck);
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
            await db.updateActiveDeck(deck);
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

        await db.updateActiveDeck(activeDeck);
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
        await db.updateActiveDeck(deck);
        res.status(200).json(deck);
    }

    public static async clearActiveDeck(req: Req, res: Res) {
        await db.updateActiveDeck([]);
        res.status(200).json([]);
    }

    public static async saveActiveDeckAs(req: Req, res: Res) {
        const activeDeck = req.body.activeDeck;
        const name = req.params.deckName;

        const savedDecks = await db.getAllSavedDecks();

        if (Object.values(savedDecks).some((deck) => deck.name === name)) {
            res.status(409).json({ error: "Name already exists" });
            return;
        }

        const newSavedDeck: SavedDeck = {
            id: randomUUID(),
            name,
            playlist: activeDeck,
        };

        // also change playlist to deck
        // await db.saveNewDeck

        res.status(200).json(newSavedDeck);
    }
}
