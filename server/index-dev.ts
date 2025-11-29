import { createServer } from "vite";
import path from "path";

const vite = await createServer({
  server: { middlewareMode: true },
  root: path.resolve(import.meta.dirname, "..", "client"),
});

const app = vite.middlewares;

app.listen(5000, "0.0.0.0", () => {
  console.log("[express] serving on port 5000");
});
