import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductInquirySchema, productFiltersSchema } from "@shared/schema";
import { sendInquiryEmail } from "./email";

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
      let product = null;
      if (inquiryData.productId) {
        product = await storage.getProduct(inquiryData.productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
      }

      // Save inquiry to database
      const inquiry = await storage.createInquiry(inquiryData);

      // Send email notification (async, don't block response)
      try {
        await sendInquiryEmail({
          name: inquiryData.name,
          email: inquiryData.email,
          company: inquiryData.company,
          phone: inquiryData.phone,
          message: inquiryData.message,
          productId: inquiryData.productId,
          productTitle: product?.title,
          productModel: product?.modelNumber,
        });
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send email notification:', emailError);
        // Could optionally return a warning to the client
      }

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
