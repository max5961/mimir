import dotenv from "dotenv";
import path from "path";
import os from "os";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "production"}` });

if (!process.env.DB_PATH) throw new Error("Cannot find env var 'DB_PATH'");
if (!process.env.DB_DIR) throw new Error("Cannot find env var 'DB_DIR'");

export const DataBasePath = path.join(os.homedir(), process.env.DB_PATH);
export const DataBaseDir = path.join(os.homedir(), process.env.DB_DIR);
