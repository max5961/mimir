import express from "express";
import { Logger } from "phileas";

type Res = express.Response;
type Req = express.Request;
type Next = express.NextFunction;

const logger = new Logger();
logger.setFile("server.log");

export function log(req: Req, res: Res, next: Next) {
    switch (req.method) {
        case "GET":
            logger.setColor("green");
            break;
        case "POST":
            logger.setColor("blue");
            break;
        case "PUT":
            logger.setColor("yellow");
            break;
        case "DELETE":
            logger.setColor("red");
            break;
        default:
            logger.setColor("cyan");
    }

    const message = `${req.method}: ${req.url}`;
    logger.write(message);

    res.on("finish", () => {
        if (res.statusCode < 200) {
            logger.setColor("blue");
        } else if (res.statusCode < 300) {
            logger.setColor("green");
        } else if (res.statusCode < 400) {
            logger.setColor("cyan");
        } else {
            logger.setColor("red");
        }
        logger.write(`[RESPONSE]: ${res.statusCode}`);
    });

    next();
}
