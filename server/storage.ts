import { type User, type InsertUser, type SelectProduct, type InsertProduct, type SelectProductInquiry, type InsertProductInquiry, type ProductFilters } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(filters?: ProductFilters): Promise<{ products: SelectProduct[], total: number }>;
  getProduct(id: string): Promise<SelectProduct | undefined>;
  createProduct(product: InsertProduct): Promise<SelectProduct>;
  
  // Inquiry methods
  createInquiry(inquiry: InsertProductInquiry): Promise<SelectProductInquiry>;
  getInquiries(): Promise<SelectProductInquiry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, SelectProduct>;
  private inquiries: SelectProductInquiry[];
  private nextInquiryId: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.inquiries = [];
    this.initializeProducts();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  private initializeProducts() {
    const sampleProducts: SelectProduct[] = [
      {
        id: 'lf5532-auto-24v',
        title: 'LF5532 Automatic Reset Pressure Switch',
        modelNumber: 'LF5532-AUTO-24V',
        image: '/assets/generated_images/Pressure_switch_product_photo_6632abba.png',
        price: '89.99',
        originalPrice: '109.99',
        category: 'Pressure Switches',
        series: 'LF55 Series',
        stockStatus: 'in_stock',
        rating: '4.8',
        reviewCount: 24,
        specifications: JSON.stringify({
          workingTemp: '-40°C to 120°C',
          pressure: '0.5-16 bar',
          voltage: '24V DC',
          connection: '1/4" NPT',
          dimensions: '65 x 45 x 30mm',
          weight: '180g',
          material: 'Stainless Steel',
          certification: 'CE, UL Listed'
        }),
        description: 'High-precision automatic reset pressure switch designed for industrial HVAC applications.',
        tags: JSON.stringify(['automatic', 'reset', 'pressure', 'switch', 'industrial']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ts4000-temp-sensor',
        title: 'TS4000 Temperature Sensor',
        modelNumber: 'TS4000-PT100',
        image: '/assets/generated_images/Heat_exchanger_product_photo_ba077dc1.png',
        price: '124.99',
        originalPrice: null,
        category: 'Temperature Sensors',
        series: 'TS4000 Series',
        stockStatus: 'in_stock',
        rating: '4.9',
        reviewCount: 18,
        specifications: JSON.stringify({
          workingTemp: '-50°C to 200°C',
          accuracy: '±0.1°C',
          response: '0.5 seconds',
          connection: '1/2" NPT',
          dimensions: '100 x 12mm',
          weight: '75g',
          material: 'Stainless Steel',
          certification: 'CE, ATEX'
        }),
        description: 'Precision PT100 temperature sensor for critical HVAC monitoring applications.',
        tags: JSON.stringify(['temperature', 'sensor', 'pt100', 'precision']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'vf200-flow-valve',
        title: 'VF200 Flow Control Valve',
        modelNumber: 'VF200-DN25',
        image: '/assets/generated_images/Refrigeration_compressor_photo_e9d26f6e.png',
        price: '245.00',
        originalPrice: '275.00',
        category: 'Valves',
        series: 'VF200 Series',
        stockStatus: 'on_order',
        rating: '4.7',
        reviewCount: 31,
        specifications: JSON.stringify({
          workingTemp: '-20°C to 150°C',
          pressure: '0-25 bar',
          flow: '0.5-50 l/min',
          connection: 'DN25 Flange',
          dimensions: '120 x 80 x 95mm',
          weight: '2.1kg',
          material: 'Brass/Steel',
          certification: 'CE, ISO 9001'
        }),
        description: 'Motorized flow control valve with precise regulation for HVAC systems.',
        tags: JSON.stringify(['flow', 'control', 'valve', 'motorized']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Product methods
  async getProducts(filters?: ProductFilters): Promise<{ products: SelectProduct[], total: number }> {
    let products = Array.from(this.products.values());

    if (filters) {
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.modelNumber.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm) ||
          p.series.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }

      // Apply series filter
      if (filters.series) {
        products = products.filter(p => p.series === filters.series);
      }

      // Apply price filters
      if (filters.priceMin !== undefined) {
        products = products.filter(p => parseFloat(p.price) >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        products = products.filter(p => parseFloat(p.price) <= filters.priceMax!);
      }

      // Apply stock status filter
      if (filters.stockStatus) {
        products = products.filter(p => p.stockStatus === filters.stockStatus);
      }

      // Apply rating filter
      if (filters.rating !== undefined) {
        products = products.filter(p => parseFloat(p.rating) >= filters.rating!);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price_desc':
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'rating':
          products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
          break;
        case 'name':
        default:
          products.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }

      // Apply pagination
      const total = products.length;
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      products = products.slice(start, end);

      return { products, total };
    }

    return { products, total: products.length };
  }

  async getProduct(id: string): Promise<SelectProduct | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<SelectProduct> {
    const newProduct: SelectProduct = {
      ...product,
      originalPrice: product.originalPrice ?? null,
      specifications: product.specifications ?? null,
      description: product.description ?? null,
      tags: product.tags ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(product.id, newProduct);
    return newProduct;
  }

  // Inquiry methods
  async createInquiry(inquiry: InsertProductInquiry): Promise<SelectProductInquiry> {
    const newInquiry: SelectProductInquiry = {
      id: this.nextInquiryId++,
      ...inquiry,
      company: inquiry.company ?? null,
      phone: inquiry.phone ?? null,
      productId: inquiry.productId ?? null,
      status: 'pending',
      createdAt: new Date()
    };
    this.inquiries.push(newInquiry);
    return newInquiry;
  }

  async getInquiries(): Promise<SelectProductInquiry[]> {
    return this.inquiries;
  }
}

export const storage = new MemStorage();
