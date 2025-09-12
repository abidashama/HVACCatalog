import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductInquirySchema, productFiltersSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API routes
  app.get("/api/products", async (req, res) => {
    try {
      // Convert string query parameters to appropriate types
      const queryParams: any = { ...req.query };
      
      // Convert numeric fields from strings to numbers, handling both string and number inputs
      if (queryParams.priceMin && typeof queryParams.priceMin === 'string') {
        const parsed = parseFloat(queryParams.priceMin);
        queryParams.priceMin = !isNaN(parsed) ? parsed : undefined;
      }
      if (queryParams.priceMax && typeof queryParams.priceMax === 'string') {
        const parsed = parseFloat(queryParams.priceMax);
        queryParams.priceMax = !isNaN(parsed) ? parsed : undefined;
      }
      if (queryParams.rating && typeof queryParams.rating === 'string') {
        const parsed = parseFloat(queryParams.rating);
        queryParams.rating = !isNaN(parsed) ? parsed : undefined;
      }
      if (queryParams.page && typeof queryParams.page === 'string') {
        const parsed = parseInt(queryParams.page, 10);
        queryParams.page = !isNaN(parsed) ? parsed : undefined;
      }
      if (queryParams.limit && typeof queryParams.limit === 'string') {
        const parsed = parseInt(queryParams.limit, 10);
        queryParams.limit = !isNaN(parsed) ? parsed : undefined;
      }
      
      const filters = productFiltersSchema.parse(queryParams);
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
      
      // Only verify the product exists if productId is provided (for product-specific inquiries)
      if (inquiryData.productId) {
        const product = await storage.getProduct(inquiryData.productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
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

  // GitHub integration routes
  app.post("/api/github/push", async (req, res) => {
    try {
      const { getUncachableGitHubClient } = await import('./github')
      const octokit = await getUncachableGitHubClient()
      
      // Get user info
      const { data: user } = await octokit.rest.users.getAuthenticated()
      
      res.json({ 
        success: true, 
        message: `Connected to GitHub as ${user.login}`,
        user: user.login 
      })
    } catch (error: any) {
      console.error('GitHub push error:', error)
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  })

  const httpServer = createServer(app);

  return httpServer;
}
