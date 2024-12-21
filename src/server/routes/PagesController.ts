import express from "express";
import { DB } from "../db.js";
import { AnyQuestionType, PageData, QUESTIONS_ARRAY, Topic } from "../model.js";

type Req = express.Request;
type Res = express.Response;

type Pointers = {
    root: Topic;
    current: Topic;
    questions: AnyQuestionType[];
};

async function getPointers(path: string[]): Promise<Pointers> {
    const root = await DB.openDb();

    // Get pointer to requested topic
    let currentPointer: undefined | Topic = root;
    for (let i = 0; i < path.length; ++i) {
        const node = path[i];

        // Topics cannot be named '$$questions'.
        if (node === QUESTIONS_ARRAY) {
            throw new Error(`Topics cannot be named: ${QUESTIONS_ARRAY}`);
        }

        // Check for invalid path
        if ((currentPointer && !currentPointer[node]) || !currentPointer) {
            throw new Error("Server received invalid path to Topic");
        }

        // Set current topic
        currentPointer = currentPointer[node] as Topic;
    }

    // Every topic should contain a questions array
    if (!currentPointer[QUESTIONS_ARRAY]) {
        throw new Error(`Missing ${QUESTIONS_ARRAY} in topic`);
    }

    return {
        root: root,
        current: currentPointer,
        questions: currentPointer[QUESTIONS_ARRAY] as AnyQuestionType[],
    };
}

function getPageData(pointers: Pointers): PageData {
    return {
        questions: pointers.questions,
        topics: Object.keys(pointers.current).filter(
            (topic: string) => topic !== QUESTIONS_ARRAY,
        ),
    };
}

/* Sends PageData */
async function getPage(req: Req, res: Res): Promise<void> {
    const path: string[] = req.body.path;
    const pointers = await getPointers(path);
    const pageData = getPageData(pointers);
    res.json(pageData);
}

/* Sends PageData */
async function postQuestion(req: Req, res: Res): Promise<void> {
    const path: string[] = req.body.path;
    const newQuestion: AnyQuestionType = JSON.parse(req.body.question);

    const pointers = await getPointers(path);
    pointers.questions.push(newQuestion);

    await DB.saveDb(pointers.root);

    const pageData = getPageData(pointers);
    res.json(pageData);
}

/* Sends PageData */
async function postTopic(req: Req, res: Res): Promise<void> {
    const path: string[] = req.body.path;
    const newTopic: string = req.body.newTopic;

    const pointers = await getPointers(path);

    if (!pointers.current[newTopic]) {
        pointers.current[newTopic] = {};
    }

    await DB.saveDb(pointers.root);

    const pageData = getPageData(pointers);
    res.json(pageData);
}

/* Sends PageData */
async function deleteQuestion(req: Req, res: Res): Promise<void> {
    const path: string[] = req.body.path;
    const id: string = req.params.id;

    const pointers = await getPointers(path);

    pointers.questions = pointers.questions.filter(
        (question) => question.id !== id,
    );

    await DB.saveDb(pointers.root);

    const pageData = getPageData(pointers);
    res.json(pageData);
}

/* Sends PageData */
async function deleteTopic(req: Req, res: Res): Promise<void> {
    const path: string[] = req.body.path;
    const name: string = req.params.name;

    const pointers = await getPointers(path);

    delete pointers.current[name];

    await DB.saveDb(pointers.root);

    const pageData = getPageData(pointers);
    res.json(pageData);
}

/* Sends PageData */
async function putTopic(req: Req, res: Res): Promise<void> {
    const path: string[] = req.body.path;
    const nextName: string = req.body.nextName;
    const name: string = req.params.name;

    const pointers = await getPointers(path);

    //
}

export default {
    getPage,
    postQuestion,
    postTopic,
    deleteQuestion,
    deleteTopic,
};
