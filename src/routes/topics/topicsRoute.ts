import express from "express";
import asyncHandler from "express-async-handler";
import Page from "./topicsController.js";

export const topicsRoute = express.Router();

topicsRoute
    .get("/:topicID", asyncHandler(Page.getTopic))
    .post("/:topicID/questions", asyncHandler(Page.postQuestion))
    .post("/:topicID/topics/:topicName", asyncHandler(Page.postTopic))
    .delete("/:topicID/questions/:questionID", asyncHandler(Page.deleteQuestion))
    .delete("/:topicID/topics/:subTopicID", asyncHandler(Page.deleteQuestion))
    .put("/:topicID/questions/:questionID", asyncHandler(Page.putQuestion))
    .put("/:topicID/topics/:subTopicID", asyncHandler(Page.putSubTopic));
