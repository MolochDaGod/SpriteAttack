import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createGrudgeWallet, getWalletFromGrudgeId, isValidGrudgeId } from "./walletService";

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

  // Wallet endpoints
  app.post("/api/wallet/create", (req, res) => {
    try {
      const wallet = createGrudgeWallet();
      
      // WARNING: In production, store privateKey securely in database
      // NEVER send privateKey to client in a real application
      // This is for demonstration only
      res.json({
        success: true,
        grudgeId: wallet.grudgeId,
        solanaAddress: wallet.solanaAddress,
        publicKey: wallet.publicKey,
        // Only for demo - remove in production
        privateKey: wallet.privateKey,
      });
    } catch (error) {
      console.error("Wallet creation error:", error);
      res.status(500).json({ success: false, error: "Failed to create wallet" });
    }
  });

  app.get("/api/wallet/:grudgeId", (req, res) => {
    try {
      const { grudgeId } = req.params;
      
      if (!isValidGrudgeId(grudgeId)) {
        return res.status(400).json({ success: false, error: "Invalid Grudge ID format" });
      }
      
      const wallet = getWalletFromGrudgeId(grudgeId);
      
      if (!wallet) {
        return res.status(404).json({ success: false, error: "Wallet not found" });
      }
      
      res.json({
        success: true,
        grudgeId,
        solanaAddress: wallet.solanaAddress,
      });
    } catch (error) {
      console.error("Wallet retrieval error:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve wallet" });
    }
  });

  return httpServer;
}
