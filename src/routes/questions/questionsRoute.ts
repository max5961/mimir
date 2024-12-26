import express from "express";
import asyncHandler from "express-async-handler";

const questionsRoute = express.Router();

questionsRoute.get(
    "/:id",
    asyncHandler(() => {}),
);
