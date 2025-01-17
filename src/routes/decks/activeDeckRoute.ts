import express from "express";
import asyncHandler from "express-async-handler";
import { Controller } from "./decksController.js";

export const activeDeck = express.Router();

activeDeck
    .get("/active", asyncHandler(Controller.getActiveDeck))
    .put("/active", asyncHandler(Controller.putActiveDeck))
    .post("/active", asyncHandler(Controller.postQuestionToActiveDeck))
    .post("/active/topic/:id", asyncHandler(Controller.postTopicToActiveDeck))
    .delete("/active/question/:id", asyncHandler(Controller.deleteQuestion))
    .delete("/active/clear", asyncHandler(Controller.clearActiveDeck));
