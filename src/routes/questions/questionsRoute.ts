import express from "express";
import asyncHandler from "express-async-handler";
import Controller from "./questionsController.js";

export const questionsRoute = express.Router();

questionsRoute
    .get("/:questionID", asyncHandler(Controller.getQuestion))
    .post("/:topicID/create", asyncHandler(Controller.postQuestion));
