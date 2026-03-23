import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

async function startServer() {
  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve RSS page
  app.get("/rss", (req, res) => {
    if (process.env.NODE_ENV !== "production") {
      res.sendFile(path.join(process.cwd(), 'rss.html'));
    } else {
      res.sendFile(path.join(process.cwd(), 'dist', 'rss.html'));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
