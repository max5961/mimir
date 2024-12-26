import express from "express";
import asyncHandler from "express-async-handler";
import Controller from "./topicsController.js";

export const topicsRoute = express.Router();

topicsRoute
    .get("/:topicID", asyncHandler(Controller.getTopic))
    .get("/data/:topicID", asyncHandler(Controller.getTopicData))
    .post("/:topicID/subtopics", asyncHandler(Controller.postTopics))
    .post("/move/:cwdID/:subTopicID", asyncHandler(Controller.moveTopic));
