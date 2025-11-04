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
  stockStatus: text('stock_status', { enum: ['in_stock', 'low_stock', 'out_of_stock', 'on_order'] }).notNull(),
  rating: decimal('rating', { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer('review_count').notNull(),
  specifications: text('specifications'), // JSON string
  description: text('description'),
  tags: text('tags'), // JSON array as string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Product inquiries table schema
export const productInquiries = pgTable('product_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  phone: text('phone'),
  message: text('message').notNull(),
  productId: text('product_id'), // Single product inquiry - optional for general inquiries
  status: text('status', { enum: ['pending', 'reviewed', 'responded'] }).default('pending'),
  createdAt: timestamp('created_at').defaultNow()
})

// Product insert/select schemas
export const insertProductSchema = createInsertSchema(products).omit({
  createdAt: true,
  updatedAt: true
})
export type InsertProduct = z.infer<typeof insertProductSchema>
export type SelectProduct = typeof products.$inferSelect

// Product inquiry insert/select schemas
export const insertProductInquirySchema = createInsertSchema(productInquiries).omit({
  id: true,
  status: true,
  createdAt: true
}).extend({
  productId: z.string().optional()
})
export type InsertProductInquiry = z.infer<typeof insertProductInquirySchema>
export type SelectProductInquiry = typeof productInquiries.$inferSelect

// Product search/filter schemas
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  series: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock', 'on_order']).optional(),
  rating: z.number().optional(),
  sortBy: z.enum(['name', 'price_asc', 'price_desc', 'newest', 'rating']).default('name'),
  page: z.number().default(1),
  limit: z.number().default(12)
})

export type ProductFilters = z.infer<typeof productFiltersSchema>

// Canonical category and series definitions based on actual backend data
export const PRODUCT_CATEGORIES = [
  {
    id: 'Pressure Switches',
    name: 'Pressure Switches', 
    slug: 'pressure-switches',
    description: 'Precision pressure control switches for HVAC and refrigeration systems'
  },
  {
    id: 'Valves',
    name: 'Valves',
    slug: 'valves',
    description: 'Flow control valves and fittings for HVAC and refrigeration systems'
  },
  {
    id: 'Pressure Transmitters',
    name: 'Pressure Transmitters',
    slug: 'pressure-transmitters',
    description: 'High-precision pressure transmitters with 4-20 mA output for industrial applications'
  },
  {
    id: 'Heat Exchangers',
    name: 'Heat Exchangers',
    slug: 'heat-exchangers',
    description: 'High-efficiency heat exchangers and BPHE for optimal thermal performance'
  },
  {
    id: 'Axeon Valves',
    name: 'Axeon Valves',
    slug: 'axeon-valves',
    description: 'Rotalock valves, hand shutoff valves, and angle valves for refrigeration systems'
  }
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]
