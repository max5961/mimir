import express from "express";
import { topicsRoute } from "./routes/topicsRoute.js";

export const app = express();

app.use("/topics", topicsRoute);
