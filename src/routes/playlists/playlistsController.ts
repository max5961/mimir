import express from "express";
import { db } from "../../database/db.js";

type Req = express.Request;
type Res = express.Response;
type Next = express.NextFunction;

export class Controller {
    public static async getActivePlaylist(req: Req, res: Res, next: Next) {
        const activePlaylist = await db.getActivePlaylist();
        res.status(200).json(activePlaylist);
    }
}
