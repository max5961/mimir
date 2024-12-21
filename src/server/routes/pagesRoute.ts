import express from "express";
import Page from "./PagesController.js";

export const pages = express.Router();

pages
    .get("/", Page.getPage)
    .post("/question", Page.postQuestion)
    .post("/topic", Page.postTopic)
    .delete("/topic/:name", Page.deleteTopic)
    .delete("/question/:id", Page.deleteQuestion);
