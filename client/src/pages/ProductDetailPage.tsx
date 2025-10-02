import { useState, useRef, useEffect } from 'react'
import { useRoute } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { Star, Heart, Share2, ShoppingCart, Download, FileText, Zap, Shield, Truck, Phone, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import InquiryModal from '@/components/modals/InquiryModal'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useToast } from '@/hooks/use-toast'
import { type SelectProduct } from '@shared/schema'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

// Helper function to parse JSON specifications safely
const parseSpecifications = (specs: string | null): Record<string, string> => {
  if (!specs) return {}
  try {
    return JSON.parse(specs)
  } catch {
    return {}
  }
}

// Helper function to get all product images (primary + any additional images)
const getProductImages = (product: SelectProduct): string[] => {
  // For now, just return the main image. In the future, could extend to support multiple images
  return [product.image]
}

// Default features, applications, and downloads for products (since backend doesn't store these yet)
const getDefaultProductFeatures = (category: string): string[] => {
  switch (category) {
    case 'Pressure Switches':
      return [
        'Precise pressure control for reliable operation',
        'Durable construction for industrial environments', 
        'Easy installation and maintenance',
        'Certified for safety compliance',
        'Wide operating temperature range'
      ]
    case 'Temperature Sensors':
      return [
        'High-precision temperature measurement',
        'Fast response time for accurate monitoring',
        'Robust construction for harsh conditions',
        'Industry-standard connections',
        'Certified accuracy and reliability'
      ]
    case 'Valves':
      return [
        'Precise flow control for optimal system performance',
        'Durable materials for long service life',
        'Easy installation and operation',
        'Wide flow range capabilities',
        'Certified for pressure ratings'
      ]
    default:
      return [
        'Professional-grade construction',
        'Reliable performance in demanding applications',
        'Easy installation and maintenance',
        'Industry-certified quality'
      ]
  }
}

const getDefaultApplications = (category: string): string[] => {
  switch (category) {
    case 'Pressure Switches':
      return [
        'Air compressor control',
        'Refrigeration system protection', 
        'HVAC pressure monitoring',
        'Hydraulic system control',
        'Industrial automation'
      ]
    case 'Temperature Sensors':
      return [
        'HVAC temperature monitoring',
        'Refrigeration system control',
        'Process temperature measurement',
        'Building automation systems',
        'Industrial process control'
      ]
    case 'Valves':
      return [
        'HVAC system control',
        'Refrigeration flow regulation',
        'Water system management',
        'Industrial process control',
        'Building automation'
      ]
    default:
      return [
        'HVAC systems',
        'Refrigeration applications',
        'Industrial processes',
        'Building automation'
      ]
  }
}

const getDefaultDownloads = (): Array<{name: string, type: string, size: string}> => [
  { name: 'Installation Manual', type: 'PDF', size: '2.4 MB' },
  { name: 'Technical Specifications', type: 'PDF', size: '0.8 MB' },
  { name: 'Wiring Diagram', type: 'PDF', size: '1.2 MB' }
]


export default function ProductDetailPage() {
  const [, params] = useRoute('/product/:slug')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [openSections, setOpenSections] = useState({
    specifications: true,
    features: false,
    applications: false,
    downloads: false
  })
  const { toast } = useToast()

  // Animation refs
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Get product data from backend API
  const slug = params?.slug || ''
  const { data: product, isLoading, error } = useQuery<SelectProduct>({
    queryKey: ['/api/products', slug],
    enabled: !!slug,
  })

  // Parse backend data for frontend use
  const specifications = product ? parseSpecifications(product.specifications) : {}
  const images = product ? getProductImages(product) : []
  const features = product ? getDefaultProductFeatures(product.category) : []
  const applications = product ? getDefaultApplications(product.category) : []
  const downloads = getDefaultDownloads()
  
  // Convert string prices to numbers for calculations
  const price = product ? parseFloat(product.price) : 0
  const originalPrice = product?.originalPrice ? parseFloat(product.originalPrice) : null

  // Toggle accordion sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // GSAP Entrance Animations
  useEffect(() => {
    if (!product || !galleryRef.current || !productInfoRef.current || !detailsRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      // Gallery entrance animation
      gsap.fromTo(galleryRef.current, 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
      )

      // Product info staggered animation
      gsap.fromTo(productInfoRef.current?.children || [], 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      )

      // Details section fade in
      gsap.fromTo(detailsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
      )
    })

    return () => {
      ctx.revert()
    }
  }, [product])

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleAddToCart = () => {
    if (!product) return
    console.log('Add to cart:', product.id, quantity)
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.title} added to your cart.`
    })
  }

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorited ? "Product removed from your favorites." : "Product saved to your favorites."
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Product link copied to clipboard."
    })
  }

  const handleDownload = (fileName: string) => {
    console.log('Download:', fileName)
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`
    })
  }

  const stockStatusConfig = {
    in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-700', badge: 'success' },
    low_stock: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', badge: 'warning' },
    on_order: { label: 'On Order', color: 'bg-blue-100 text-blue-700', badge: 'info' },
    out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-700', badge: 'destructive' }
  }

  const stockConfig = product ? stockStatusConfig[product.stockStatus] : stockStatusConfig.out_of_stock
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSkeleton className="h-96" />
        </div>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/products">View All Products</a>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb />
        </div>
      </div>
      
      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-muted-foreground">
            <span>Home</span> / <span>Products</span> / <span>{product.category}</span> / <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4" ref={galleryRef}>
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg border"
                data-testid="product-main-image"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm min-h-[44px] min-w-[44px]"
                    onClick={handlePreviousImage}
                    data-testid="button-previous-image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm min-h-[44px] min-w-[44px]"
                    onClick={handleNextImage}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-md border-2 overflow-hidden ${
                      currentImageIndex === index ? 'border-primary' : 'border-border'
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img src={image} alt={`${product.title} view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.series}</Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-muted-foreground mb-2">Model: {product.modelNumber}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(parseFloat(product.rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {parseFloat(product.rating).toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-foreground">${price.toFixed(2)}</div>
                {originalPrice && (
                  <div className="text-lg text-muted-foreground line-through">${originalPrice.toFixed(2)}</div>
                )}
                {originalPrice && (
                  <Badge variant="destructive">
                    Save ${(originalPrice - price).toFixed(2)}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className={stockConfig.color} variant="outline">
                    {stockConfig.label}
                  </Badge>
                  {product.stockStatus === 'in_stock' && (
                    <span className="text-sm text-muted-foreground">Available</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Ships in 1-2 business days</span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">2 years manufacturer warranty</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="min-h-[44px] min-w-[44px]"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-quantity-decrease"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center" data-testid="text-quantity">{quantity}</span>
                    <Button
                      variant="outline"
                      className="min-h-[44px] min-w-[44px]"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-quantity-increase"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="lg" 
                    className="flex-1 min-h-[44px]"
                    onClick={handleAddToCart}
                    disabled={product.stockStatus === 'out_of_stock'}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-[44px] min-w-[44px]"
                    onClick={handleToggleFavorite}
                    data-testid="button-toggle-favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-[44px] min-w-[44px]"
                    onClick={handleShare}
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full min-h-[44px]" 
                  data-testid="button-request-quote"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Request Quote
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordions */}
        <div className="mt-16" ref={detailsRef}>
          <h2 className="text-2xl font-bold text-foreground mb-8">Product Details</h2>
          
          <div className="space-y-4">
            {/* Technical Specifications */}
            <Collapsible open={openSections.specifications} onOpenChange={() => toggleSection('specifications')}>
              <Card>
                <CollapsibleTrigger className="w-full" data-testid="toggle-specifications">
                  <CardHeader className="hover-elevate">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left">Technical Specifications</CardTitle>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                        openSections.specifications ? 'transform rotate-180' : ''
                      }`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                          <span className="font-medium text-foreground">{key}:</span>
                          <span className="text-muted-foreground text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Key Features */}
            <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
              <Card>
                <CollapsibleTrigger className="w-full" data-testid="toggle-features">
                  <CardHeader className="hover-elevate">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left">Key Features</CardTitle>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                        openSections.features ? 'transform rotate-180' : ''
                      }`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <ul className="space-y-3">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Typical Applications */}
            <Collapsible open={openSections.applications} onOpenChange={() => toggleSection('applications')}>
              <Card>
                <CollapsibleTrigger className="w-full" data-testid="toggle-applications">
                  <CardHeader className="hover-elevate">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left">Typical Applications</CardTitle>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                        openSections.applications ? 'transform rotate-180' : ''
                      }`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {applications.map((application, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-md">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-foreground">{application}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Documentation & Downloads */}
            <Collapsible open={openSections.downloads} onOpenChange={() => toggleSection('downloads')}>
              <Card>
                <CollapsibleTrigger className="w-full" data-testid="toggle-downloads">
                  <CardHeader className="hover-elevate">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left">Documentation & Downloads</CardTitle>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                        openSections.downloads ? 'transform rotate-180' : ''
                      }`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      {downloads.map((download, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-md hover-elevate">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <h4 className="font-medium text-foreground">{download.name}</h4>
                              <p className="text-sm text-muted-foreground">{download.type} • {download.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="min-h-[44px] min-w-[44px]"
                            onClick={() => handleDownload(download.name)}
                            data-testid={`button-download-${index}`}
                          >
                            <Download className="mr-2 w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>

        {/* Related Products - TODO: Implement related products API */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Explore more products in our catalog</p>
            <Button asChild>
              <a href="/products">View All Products</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}