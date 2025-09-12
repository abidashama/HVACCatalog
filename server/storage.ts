import { type User, type InsertUser, type SelectProduct, type InsertProduct, type SelectCartItem, type InsertCartItem, type CartItemWithProduct, type SelectQuoteRequest, type InsertQuoteRequest, type ProductFilters } from "@shared/schema";
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
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(sessionId: string, productId: string, quantity: number): Promise<SelectCartItem>;
  updateCartItem(sessionId: string, productId: string, quantity: number): Promise<SelectCartItem | undefined>;
  removeFromCart(sessionId: string, productId: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
  getCartCount(sessionId: string): Promise<number>;
  
  // Quote methods
  createQuoteRequest(quote: InsertQuoteRequest): Promise<SelectQuoteRequest>;
  getQuoteRequests(): Promise<SelectQuoteRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, SelectProduct>;
  private cartItems: Map<string, SelectCartItem[]>; // sessionId -> cart items
  private quoteRequests: SelectQuoteRequest[];
  private nextCartItemId: number = 1;
  private nextQuoteId: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.quoteRequests = [];
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
        image: '/api/placeholder/300/300',
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
        image: '/api/placeholder/300/300',
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
        image: '/api/placeholder/300/300',
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(product.id, newProduct);
    return newProduct;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = this.cartItems.get(sessionId) || [];
    const cartWithProducts: CartItemWithProduct[] = [];

    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        cartWithProducts.push({
          id: item.id!,
          sessionId: item.sessionId,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: product.id,
            title: product.title,
            modelNumber: product.modelNumber,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            series: product.series,
            stockStatus: product.stockStatus
          },
          createdAt: item.createdAt!.toISOString(),
          updatedAt: item.updatedAt!.toISOString()
        });
      }
    }

    return cartWithProducts;
  }

  async addToCart(sessionId: string, productId: string, quantity: number): Promise<SelectCartItem> {
    const items = this.cartItems.get(sessionId) || [];
    const existingItemIndex = items.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Update existing item
      items[existingItemIndex].quantity += quantity;
      items[existingItemIndex].updatedAt = new Date();
      this.cartItems.set(sessionId, items);
      return items[existingItemIndex];
    } else {
      // Add new item
      const newItem: SelectCartItem = {
        id: this.nextCartItemId++,
        sessionId,
        productId,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      items.push(newItem);
      this.cartItems.set(sessionId, items);
      return newItem;
    }
  }

  async updateCartItem(sessionId: string, productId: string, quantity: number): Promise<SelectCartItem | undefined> {
    const items = this.cartItems.get(sessionId) || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        items.splice(itemIndex, 1);
        this.cartItems.set(sessionId, items);
        return undefined;
      } else {
        // Update quantity
        items[itemIndex].quantity = quantity;
        items[itemIndex].updatedAt = new Date();
        this.cartItems.set(sessionId, items);
        return items[itemIndex];
      }
    }

    return undefined;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<boolean> {
    const items = this.cartItems.get(sessionId) || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
      items.splice(itemIndex, 1);
      this.cartItems.set(sessionId, items);
      return true;
    }

    return false;
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItems.set(sessionId, []);
  }

  async getCartCount(sessionId: string): Promise<number> {
    const items = this.cartItems.get(sessionId) || [];
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Quote methods
  async createQuoteRequest(quote: InsertQuoteRequest): Promise<SelectQuoteRequest> {
    const newQuote: SelectQuoteRequest = {
      id: this.nextQuoteId++,
      ...quote,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quoteRequests.push(newQuote);
    return newQuote;
  }

  async getQuoteRequests(): Promise<SelectQuoteRequest[]> {
    return this.quoteRequests;
  }
}

export const storage = new MemStorage();
