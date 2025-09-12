import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product table schema
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  modelNumber: text('model_number').notNull(),
  image: text('image').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  category: text('category').notNull(),
  series: text('series').notNull(),
  stockStatus: text('stock_status', { enum: ['in_stock', 'out_of_stock', 'on_order'] }).notNull(),
  rating: decimal('rating', { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer('review_count').notNull(),
  specifications: text('specifications'), // JSON string
  description: text('description'),
  tags: text('tags'), // JSON array as string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Cart items table schema
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Quote requests table schema
export const quoteRequests = pgTable('quote_requests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  phone: text('phone'),
  message: text('message'),
  productIds: text('product_ids'), // JSON array as string
  status: text('status', { enum: ['pending', 'reviewed', 'quoted', 'closed'] }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Product insert/select schemas
export const insertProductSchema = createInsertSchema(products).omit({
  createdAt: true,
  updatedAt: true
})
export type InsertProduct = z.infer<typeof insertProductSchema>
export type SelectProduct = typeof products.$inferSelect

// Cart item insert/select schemas
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type InsertCartItem = z.infer<typeof insertCartItemSchema>
export type SelectCartItem = typeof cartItems.$inferSelect

// Quote request insert/select schemas
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
})
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>
export type SelectQuoteRequest = typeof quoteRequests.$inferSelect

// API response schemas
export const productSpecificationsSchema = z.object({
  workingTemp: z.string().optional(),
  pressure: z.string().optional(),
  voltage: z.string().optional(),
  connection: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  material: z.string().optional(),
  certification: z.string().optional()
})

export type ProductSpecifications = z.infer<typeof productSpecificationsSchema>

// Cart with product details
export const cartItemWithProductSchema = z.object({
  id: z.number(),
  sessionId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  product: z.object({
    id: z.string(),
    title: z.string(),
    modelNumber: z.string(),
    image: z.string(),
    price: z.string(),
    originalPrice: z.string().optional(),
    category: z.string(),
    series: z.string(),
    stockStatus: z.enum(['in_stock', 'out_of_stock', 'on_order'])
  }),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type CartItemWithProduct = z.infer<typeof cartItemWithProductSchema>

// Product search/filter schemas
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  series: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  stockStatus: z.enum(['in_stock', 'out_of_stock', 'on_order']).optional(),
  rating: z.number().optional(),
  sortBy: z.enum(['name', 'price_asc', 'price_desc', 'newest', 'rating']).default('name'),
  page: z.number().default(1),
  limit: z.number().default(12)
})

export type ProductFilters = z.infer<typeof productFiltersSchema>
