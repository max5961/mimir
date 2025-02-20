import "./env/Env.js";
import React from "react";
import { preserveScreen, render, setMouseReporting, setConsole } from "tuir";
import App from "./views/App.js";
import { app, getPath } from "./server/server.js";
import { DataBase } from "./database/DataBase.js";
import { Provider } from "react-redux";
import store from "./views/store/store.js";

DataBase.initializeDataBaseSync();
const server = app.listen(0);

// @ts-ignore
export const Port = server.address().port;
export const BaseURL = `http://localhost:${Port}`;
export const Path = getPath(BaseURL);
export const RootTopic = DataBase.getRootTopicSync();

preserveScreen();
setMouseReporting(true);
setConsole(true);

render(
    <Provider store={store}>
        <App />
    </Provider>,
);
