import "./env/Env.js";
import React from "react";
import { logger, preserveScreen, render } from "phileas";
import App from "./views/App.js";
import { app } from "./server/server.js";
import { DataBase } from "./database/DataBase.js";
import { Provider } from "react-redux";
import store from "./views/store/store.js";

DataBase.initializeDataBase();
const server = app.listen(0);

// @ts-ignore
export const Port = server.address().port;
export const BaseURL = `http://localhost:${Port}`;
export const RootTopic = DataBase.getRootTopic();
// logger.write(RootTopic);

preserveScreen();
render(
    <Provider store={store}>
        <App />
    </Provider>,
);
