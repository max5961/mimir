import React from "react";
import { preserveScreen, render } from "phileas";
import App from "./App.js";
import { app } from "./server/server.js";
import { DB } from "./server/db.js";

preserveScreen();

// Creates/checks for json file in ~/.local/share/quiz
DB.createDataBase();

const server = app.listen(0);

// @ts-ignore
const port = server.address().port;

render(<App port={port} />);
