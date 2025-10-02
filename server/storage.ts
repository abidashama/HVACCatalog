import { type User, type InsertUser, type SelectProduct, type InsertProduct, type SelectProductInquiry, type InsertProductInquiry, type ProductFilters } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

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

    // Load real Pressure Switches data from JSON and populate products
    this.loadPressureSwitchProducts();
  }

  private loadPressureSwitchProducts() {
    try {
      const jsonPath = path.resolve(process.cwd(), 'client', 'src', 'assets', 'data', 'pressure-switch.json');
      if (!fs.existsSync(jsonPath)) {
        return;
      }
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw) as any;
      const categories = data?.categories ?? {};

      const addProduct = (p: Omit<SelectProduct, 'createdAt' | 'updatedAt'>) => {
        const product: SelectProduct = { ...p, createdAt: new Date(), updatedAt: new Date() };
        this.products.set(product.id, product);
      };

      const baseImage = '/assets/generated_images/Pressure_switch_product_photo_6632abba.png';

      // Helper to generate price in a stable but varied way based on model text
      const priceFor = (model: string) => {
        const hash = Array.from(model).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const base = 70 + (hash % 60); // 70 - 129
        return base.toFixed(2);
      };

      const seriesFromModel = (model: string): string => {
        const upper = model.replace(/\s+/g, '').toUpperCase();
        if (upper.startsWith('LF08')) return 'LF08 Series';
        if (upper.startsWith('LF5D')) return 'LF5D Series';
        if (upper.startsWith('LF58')) return 'LF58 Series';
        if (upper.startsWith('LF32')) return 'LF32 Series';
        if (upper.startsWith('LF55') || upper.startsWith('LF 55')) return 'LF55 Series';
        return 'LF55 Series';
      };

      // PRESSURE SWITCH FOR WATERLINE
      const waterline = categories.pressureSwitches;
      if (waterline?.products) {
        for (const item of waterline.products as any[]) {
          const model: string = item.model;
          const title = `${waterline.name} - ${model}`;
          addProduct({
            id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            modelNumber: model,
            image: baseImage,
            price: priceFor(model),
            originalPrice: null,
            category: 'Pressure Switches',
            series: seriesFromModel(model),
            stockStatus: 'in_stock',
            rating: '4.8',
            reviewCount: 12,
            specifications: JSON.stringify({
              pressure: item.range,
              connection: waterline.connection ?? undefined,
              certification: (waterline.certifications || []).join(', ')
            }),
            description: `${waterline.name} model ${model} with range ${item.range}.`,
            tags: JSON.stringify(['pressure', 'switch', 'waterline', model])
          });
        }
      }

      // LP & HP PRESSURE SWITCH FOR REFRIGERATION
      const lpHp = categories.lpHpRefrigerationSwitches;
      if (lpHp?.products) {
        for (const item of lpHp.products as any[]) {
          const model: string = item.model;
          const title = `${lpHp.name} - ${model}`;
          addProduct({
            id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            modelNumber: model,
            image: baseImage,
            price: priceFor(model),
            originalPrice: null,
            category: 'Pressure Switches',
            series: seriesFromModel(model),
            stockStatus: 'in_stock',
            rating: '4.7',
            reviewCount: 9,
            specifications: JSON.stringify({
              pressure: item.range,
              resetOption: item.resetOption,
              connection: lpHp.connection ?? undefined,
              certification: (lpHp.certifications || []).join(', ')
            }),
            description: `${lpHp.name} ${model}.`,
            tags: JSON.stringify(['pressure', 'switch', 'refrigeration', model])
          });
        }
      }

      // LP-HP COMBINED PRESSURE SWITCH
      const combined = categories.lpHpCombinedSwitches;
      if (combined?.products) {
        for (const item of combined.products as any[]) {
          const model: string = item.model;
          const title = `${combined.name} - ${model}`;
          addProduct({
            id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            modelNumber: model,
            image: baseImage,
            price: priceFor(model),
            originalPrice: null,
            category: 'Pressure Switches',
            series: seriesFromModel(model),
            stockStatus: 'in_stock',
            rating: '4.7',
            reviewCount: 7,
            specifications: JSON.stringify({
              pressure: item.range,
              resetOption: item.resetOption ? JSON.stringify(item.resetOption) : undefined,
              connection: combined.connection ?? undefined,
              certification: (combined.certifications || []).join(', ')
            }),
            description: `${combined.name} ${model}.`,
            tags: JSON.stringify(['pressure', 'switch', 'combined', model])
          });
        }
      }

      // SMALL FIX DIFFERENTIAL PRESSURE SWITCH (LF08)
      const smallFix = categories.smallFixDifferentialSwitches;
      if (smallFix) {
        const model: string = smallFix.model ?? 'LF08';
        const title = `${smallFix.name} - ${model}`;
        const ranges: string[] = [
          ...(smallFix.highPressureRanges?.map((r: any) => r.range) || []),
          ...(smallFix.lowPressureRanges?.map((r: any) => r.range) || [])
        ];
        addProduct({
          id: `${model.toLowerCase()}-cartridge`.replace(/[^a-z0-9]+/g, '-'),
          title,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          originalPrice: null,
          category: 'Pressure Switches',
          series: seriesFromModel(model),
          stockStatus: 'in_stock',
          rating: '4.6',
          reviewCount: 11,
          specifications: JSON.stringify({
            pressure: ranges.join(' | '),
            connection: smallFix.connection ?? undefined,
            certification: (smallFix.certifications || []).join(', '),
            refrigerants: smallFix.refrigerants ?? undefined
          }),
          description: `${smallFix.name} ${model}.`,
          tags: JSON.stringify(['pressure', 'switch', 'differential', model])
        });
      }

      // OIL DIFFERENTIAL PRESSURE SWITCH (LF5D)
      const oilDiff = categories.oilDifferentialSwitches;
      if (oilDiff?.products) {
        for (const item of oilDiff.products as any[]) {
          const model: string = item.model;
          const title = `${oilDiff.name} - ${model}`;
          addProduct({
            id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            modelNumber: model,
            image: baseImage,
            price: priceFor(model),
            originalPrice: null,
            category: 'Pressure Switches',
            series: seriesFromModel(model),
            stockStatus: 'in_stock',
            rating: '4.5',
            reviewCount: 8,
            specifications: JSON.stringify({
              pressure: item.range,
              maxOperatingPressureBar: item.maxOperatingPressureBar,
              connection: oilDiff.connection ?? undefined,
              certification: (oilDiff.certifications || []).join(', ')
            }),
            description: `${oilDiff.name} ${model}.`,
            tags: JSON.stringify(['pressure', 'switch', 'oil', model])
          });
        }
      }

      // AIR DIFFERENTIAL PRESSURE SWITCH (LF32)
      const air = categories.airDifferentialSwitches;
      if (air?.products) {
        for (const item of air.products as any[]) {
          const model: string = item.model;
          const title = `${air.name} - ${model}`;
          const range = Array.isArray(item.range) ? item.range.join(' | ') : item.range;
          addProduct({
            id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            modelNumber: model,
            image: baseImage,
            price: priceFor(model),
            originalPrice: null,
            category: 'Pressure Switches',
            series: seriesFromModel(model),
            stockStatus: 'in_stock',
            rating: '4.7',
            reviewCount: 13,
            specifications: JSON.stringify({
              pressure: range,
              certification: (air.certifications || []).join(', ')
            }),
            description: `${air.name} ${model}.`,
            tags: JSON.stringify(['pressure', 'switch', 'air', model])
          });
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load pressure switch data:', err);
    }
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
