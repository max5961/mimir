import express from "express";
import { db } from "../../database/db.js";
import { ActiveDeck } from "../../models/DeckModel.js";

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
        await db.saveActiveDeck(nextActiveDeck);
        res.status(200).json(nextActiveDeck);
    }
}
