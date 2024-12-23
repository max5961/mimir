import dotenv from "dotenv";
import React from "react";
import { preserveScreen, render } from "phileas";
import App from "./views/App.js";
import { app } from "./server.js";
import { DataBase } from "./database/DataBase.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "production"}` });

DataBase.initializeDataBase();
const server = app.listen(0);

// @ts-ignore
export const Port = server.address().port;
export const BaseURL = `http://localhost:${Port}`;
export const RootTopic = DataBase.getRootTopic();

preserveScreen();
render(<App />);
