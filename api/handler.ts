import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";
import { app } from "../server/app";
import { registerRoutes } from "../server/routes";

// Ensure routes are registered once
let initialized = false;
export default async (req: VercelRequest, res: VercelResponse) => {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }

  // Serve static files
  const publicPath = path.join(process.cwd(), "public");
  const urlPath = new URL(req.url || "/", "http://localhost").pathname;

  // Don't serve static for API routes
  if (!urlPath.startsWith("/api/")) {
    const filePath = path.join(publicPath, urlPath === "/" ? "index.html" : urlPath);

    if (fs.existsSync(filePath) && filePath.startsWith(publicPath)) {
      try {
        const content = fs.readFileSync(filePath);
        res.setHeader("Content-Type", getContentType(filePath));
        res.setHeader("Cache-Control", urlPath.includes("assets/") ? "public, max-age=31536000" : "no-cache");
        return res.end(content);
      } catch (e) {
        // Fall through
      }
    }

    // SPA routing - serve index.html
    const indexPath = path.join(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      try {
        const content = fs.readFileSync(indexPath, "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "no-cache");
        return res.end(content);
      } catch (e) {
        // Fall through
      }
    }
  }

  // Handle API routes through Express
  return new Promise<void>((resolve) => {
    app(req, res as any);
    res.on("finish", () => resolve());
  });
};

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
  };
  return types[ext] || "application/octet-stream";
}
