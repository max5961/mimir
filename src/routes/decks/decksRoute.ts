import express from "express";
import asyncHandler from "express-async-handler";
import { Controller } from "./decksController.js";

export const decksRoute = express.Router();

decksRoute
    .get("/active", asyncHandler(Controller.getActiveDeck))
    .put("/active", asyncHandler(Controller.putActiveDeck))
    .post("/active", asyncHandler(Controller.postQuestionToActiveDeck))
    .post("/active/topic/:id", asyncHandler(Controller.postTopicToActiveDeck))
    .delete("/active/question/:id", asyncHandler(Controller.deleteQuestion))
    .delete("/active/clear", asyncHandler(Controller.clearActiveDeck))
    .get("/saved", asyncHandler(Controller.getSavedDecks))
    .post("/saved/:name", asyncHandler(Controller.saveActiveDeckAs))
    .delete("/saved/:id", asyncHandler(Controller.deleteSavedDeck))
    .post(
        "/saved/from-active/:targetID",
        asyncHandler(Controller.postToSavedFromActiveDeck),
    );
