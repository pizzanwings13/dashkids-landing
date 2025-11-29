import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default async (req: VercelRequest, res: VercelResponse) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;

  // Static files are built to dist/public
  const publicDir = path.join(process.cwd(), "dist", "public");
  
  // Try to serve the requested file
  let filePath = path.join(publicDir, pathname === "/" ? "index.html" : pathname);
  
  // Security check
  const normalizedPath = path.normalize(filePath);
  const normalizedPublic = path.normalize(publicDir);
  if (!normalizedPath.startsWith(normalizedPublic)) {
    return res.status(403).send("Forbidden");
  }

  // Try exact file match
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath);
      const types: Record<string, string> = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".woff2": "font/woff2",
      };
      res.setHeader("Content-Type", types[ext] || "application/octet-stream");
      if (pathname.includes("assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
      return res.end(content);
    } catch (e) {
      return res.status(500).send("Error reading file");
    }
  }

  // Fallback to index.html for SPA routing
  const indexPath = path.join(publicDir, "index.html");
  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      return res.end(content);
    } catch (e) {
      return res.status(500).send("Error reading index.html");
    }
  }

  return res.status(404).send("Not Found");
};
