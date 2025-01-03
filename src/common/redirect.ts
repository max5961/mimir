import fetch from "node-fetch";
import express from "express";
import { logger } from "tuir";

export const redirect = async (
    req: express.Request,
    res: express.Response,
    url: string,
) => {
    const response = await fetch(`${req.protocol}://${req.headers.host}${url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        res.status(400).send(response.status);
    }

    const data = await response.json();

    res.status(200).json(data);
};
