import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default async (req: VercelRequest, res: VercelResponse) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;

  // In Vercel, static files can be in multiple possible locations
  let publicDir = path.join(process.cwd(), "..", "..", "public");
  
  // Fallback locations
  if (!fs.existsSync(publicDir)) {
    publicDir = path.join(process.cwd(), "..", "public");
  }
  if (!fs.existsSync(publicDir)) {
    publicDir = path.join(process.cwd(), "public");
  }
  if (!fs.existsSync(publicDir)) {
    publicDir = path.join(process.cwd(), "dist", "public");
  }

  // Build the file path
  let filePath = path.join(publicDir, pathname === "/" ? "index.html" : pathname);
  
  // Security check - prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  const normalizedPublic = path.normalize(publicDir);
  if (!normalizedPath.startsWith(normalizedPublic)) {
    return res.status(403).send("Forbidden");
  }

  // Try to serve the requested file
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    try {
      const content = fs.readFileSync(filePath);
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
      };
      
      res.setHeader("Content-Type", types[ext] || "application/octet-stream");
      
      // Cache immutable assets
      if (pathname.includes("assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (ext === ".html") {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
      
      return res.end(content);
    } catch (e) {
      console.error("Error serving file:", e);
      return res.status(500).send("Error reading file");
    }
  }

  // Fallback to index.html for client-side routing (SPA)
  const indexPath = path.join(publicDir, "index.html");
  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      return res.end(content);
    } catch (e) {
      console.error("Error serving index.html:", e);
      return res.status(500).send("Error reading index.html");
    }
  }

  // If nothing found, return 404
  return res.status(404).send("Not Found");
};
