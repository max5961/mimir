import express from "express";
import { topicsRoute } from "../routes/topics/topicsRoute.js";
import createHttpError from "http-errors";
import { log } from "./middleware.js";
import { logger } from "phileas";

export const app = express();

app.use(express.json());
app.use(log);

app.use("/api/topics", topicsRoute);

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
        logger.file("server.log").color("red").write(`RESPONSE ERROR`, message);

        res.status(status).send(message);
    },
);
