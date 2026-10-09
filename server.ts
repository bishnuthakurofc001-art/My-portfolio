import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve static assets from public/ (CSS, JS, fonts, favicons)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Exact page routes for bleibtgleich.dev
  app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "pages", "index.html"));
  });

  app.get("/work", (req, res) => {
    res.sendFile(path.join(process.cwd(), "pages", "work.html"));
  });

  app.get("/contact", (req, res) => {
    res.sendFile(path.join(process.cwd(), "pages", "contact.html"));
  });

  app.get("/archive", (req, res) => {
    res.sendFile(path.join(process.cwd(), "pages", "archive.html"));
  });

  app.get("/works/:slug", (req, res) => {
    let slug = req.params.slug;
    if (slug === "bishnu25") slug = "bleibtgleich25";
    if (slug === "bishnu23") slug = "bleibtgleich23";
    const filePath = path.join(process.cwd(), "pages", "works", `${slug}.html`);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.redirect("/work");
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "pages", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`bleibtgleich server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
