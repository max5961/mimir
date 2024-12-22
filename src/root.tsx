import React from "react";
import { preserveScreen, render } from "phileas";
import App from "./App.js";
import { app } from "./server/server.js";
import { DB } from "./server/db.js";

preserveScreen();

// Creates/checks for json file in ~/.local/share/quiz
DB.createDataBase({ sample: true });
export const ROOT_TOPIC = DB.getRootTopic();

const server = app.listen(0);

//@ts-ignore
export const PORT = server.address().port;
export const BASE_URL = `http://localhost:${PORT}`;

render(<App />);
