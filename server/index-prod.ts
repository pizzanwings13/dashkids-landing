import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // In Vercel, the current working directory is the root of the project
  const publicPath = path.join(process.cwd(), "dist", "public");

  if (!fs.existsSync(publicPath)) {
    console.error(`Error: Public directory not found at ${publicPath}`);
    console.error("Available dirs:", fs.readdirSync(path.join(process.cwd(), "dist")).slice(0, 5));
  }

  app.use(express.static(publicPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(publicPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
