import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductInquirySchema, productFiltersSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API routes
  app.get("/api/products", async (req, res) => {
    try {
      const filters = productFiltersSchema.parse(req.query);
      const result = await storage.getProducts(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(400).json({ error: "Invalid filters" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Inquiries API routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertProductInquirySchema.parse(req.body);
      
      // Verify the product exists
      const product = await storage.getProduct(inquiryData.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(400).json({ error: "Invalid inquiry data" });
    }
  });

  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
