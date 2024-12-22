import express from "express";
import { topicsRoute } from "./routes/topicsRoute.js";
import { logger } from "phileas";

export const app = express();

app.use(express.json());
app.use((req, res, next) => {
    const url = req.url;
    const method = req.method;
    const msg = `${method}: ${url}`;

    if (method === "GET") {
        logger.color("green").write(msg);
    }
    if (method === "POST") {
        logger.color("blue").write(msg);
    }
    if (method === "PUT") {
        logger.color("yellow").write(msg);
    }
    if (method === "DELETE") {
        logger.color("red").write(msg);
    }

    next();
});

app.use("/topics", topicsRoute);
