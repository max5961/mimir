import express from "express";
import Page from "./TopicsController.js";

export const topicsRoute = express.Router();

topicsRoute
    .get("/:topicID", Page.getTopic)
    .post("/:topicID/questions", Page.postQuestion)
    .post("/:topicID/topics/:topicName", Page.postTopic)
    .delete("/:topicID/questions/:questionID", Page.deleteQuestion)
    .delete("/:topicID/topics/:subTopicID", Page.deleteQuestion)
    .put("/:topicID/questions/:questionID", Page.putQuestion)
    .put("/:topicID/topics/:subTopicID", Page.putTopic);
