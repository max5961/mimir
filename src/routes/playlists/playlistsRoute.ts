import express from "express";
import asyncHandler from "express-async-handler";
import { Controller } from "./playlistsController.js";

export const playlistsRoute = express.Router();

playlistsRoute.get("/active", asyncHandler(Controller.getActivePlaylist));
