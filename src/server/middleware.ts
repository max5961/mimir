import express from "express";
import { Logger } from "tuir";

type Res = express.Response;
type Req = express.Request;
type Next = express.NextFunction;

export const serverLogger = new Logger();
serverLogger.setFile("server.log");

export function log(req: Req, res: Res, next: Next) {
    switch (req.method) {
        case "GET":
            serverLogger.setColor("green");
            break;
        case "POST":
            serverLogger.setColor("blue");
            break;
        case "PUT":
            serverLogger.setColor("yellow");
            break;
        case "DELETE":
            serverLogger.setColor("red");
            break;
        default:
            serverLogger.setColor("cyan");
    }

    const message = `${req.method}: ${req.url}`;
    serverLogger.write(message);

    res.on("finish", () => {
        if (res.statusCode < 200) {
            serverLogger.setColor("blue");
        } else if (res.statusCode < 300) {
            serverLogger.setColor("green");
        } else if (res.statusCode < 400) {
            serverLogger.setColor("cyan");
        } else {
            serverLogger.setColor("red");
        }
        serverLogger.write(`[RESPONSE]: ${res.statusCode}`);
    });

    next();
}
