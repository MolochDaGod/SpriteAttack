import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Game API Routes - all prefixed with /api
  
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get game data
  app.get("/api/game/characters", (_req, res) => {
    res.json({
      characters: [
        { id: "knight", name: "Knight", faction: "crusade" },
        { id: "wizard", name: "Wizard", faction: "fabled" },
        { id: "orc", name: "Orc", faction: "legion" },
      ],
    });
  });

  // Save game state (example)
  app.post("/api/game/save", (req, res) => {
    const { playerId, gameState } = req.body;
    // In production, save to database
    res.json({ success: true, playerId, saved: true });
  });

  // GDevelop integration endpoint
  app.post("/api/gdevelop/event", (req, res) => {
    const { eventType, data } = req.body;
    console.log("GDevelop event:", eventType, data);
    res.json({ received: true, eventType });
  });

  return httpServer;
}
