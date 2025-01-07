import express from "express";
import { topicsRoute } from "../routes/topics/topicsRoute.js";
import createHttpError from "http-errors";
import { log, serverLogger } from "./middleware.js";
import { questionsRoute } from "../routes/questions/questionsRoute.js";
import { playlistsRoute } from "../routes/playlists/playlistsRoute.js";

export const getPath = (baseURL: string) => {
    return {
        Api: {
            Topics: `${baseURL}/api/topics`,
            Questions: `${baseURL}/api/questions`,
            Playlists: `${baseURL}/api/playlists`,
        },
    };
};

const Path = getPath("");

export const app = express();

app.use(express.json());
app.use(log);

app.use(Path.Api.Topics, topicsRoute);
app.use(Path.Api.Questions, questionsRoute);
app.use(Path.Api.Playlists, playlistsRoute);

app.use((_req, _res, next) => {
    next(createHttpError(404, "Not found"));
});

app.use(
    (
        err: createHttpError.HttpError,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        const status = err.status || 500;
        const message = err.message || "Unknown Error occured";
        serverLogger.color("red").write(`RESPONSE ERROR`, message);

        res.status(status).send(message);
    },
);
