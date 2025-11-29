import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";
import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // Vercel puts dist folder in the root of the deployed project
  let publicPath = path.join("/tmp/projectRoot", "dist", "public");
  
  // Fallback for local testing
  if (!fs.existsSync(publicPath)) {
    publicPath = path.join(process.cwd(), "dist", "public");
  }
  
  // Last resort - look relative to this file
  if (!fs.existsSync(publicPath)) {
    publicPath = path.join(import.meta.dirname, "..", "public");
  }

  console.log(`[info] Looking for public files at: ${publicPath}`);
  console.log(`[info] Exists: ${fs.existsSync(publicPath)}`);

  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not Found - index.html not found at " + indexPath);
    }
  });
}

(async () => {
  await runApp(serveStatic);
})();
