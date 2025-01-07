import dotenv from "dotenv";
import path from "path";
import os from "os";

process.env.NODE_ENV = process.env.NODE_ENV ?? "production";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (!process.env.DB_DIR) throw new Error("Cannot find env var 'DB_DIR'");
if (!process.env.TOPICS_PATH) throw new Error("Cannot find env var 'TOPICS_PATH'");
if (!process.env.DECKS_PATH) throw new Error("Cannot find env var 'PLAYLISTS_PATH'");

export const TopicsPath = path.join(os.homedir(), process.env.TOPICS_PATH);
export const DecksPath = path.join(os.homedir(), process.env.DECKS_PATH);
export const DataBaseDir = path.join(os.homedir(), process.env.DB_DIR);

export const NodeEnv = process.env.NODE_ENV as "production" | "development" | "test";
