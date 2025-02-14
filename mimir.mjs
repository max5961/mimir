#!/usr/bin/env node

process.env.NODE_ENV = "production";

(async () => {
    await import("./dist/root.js");
})();
