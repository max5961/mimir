import express from "express";
import asyncHandler from "express-async-handler";
import { Controller } from "./decksController.js";

export const decksRoute = express.Router();

decksRoute
    .get("/active", asyncHandler(Controller.getActiveDeck))
    .put("/active", asyncHandler(Controller.putActiveDeck));
