import fs from "node:fs";
import path from "node:path";
import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";
import { app as baseApp } from "../server/app";

const app = baseApp;
let initialized = false;

async function initializeApp() {
  if (initialized) return app;

  const distPath = path.resolve(process.cwd(), "public");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use("*", (_req, _res, next) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        _res.sendFile(indexPath);
      } else {
        next();
      }
    });
  }

  initialized = true;
  return app;
}

// Register all API routes
registerRoutes(app);

// Main handler for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  await initializeApp();
  app(req, res);
};
