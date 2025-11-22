import { useState, useRef, useEffect } from 'react'
import { useRoute, useLocation } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { Heart, Share2, ShoppingCart, Download, FileText, Zap, Shield, Truck, Phone, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
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
  const [, setLocation] = useLocation()
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
    const url = `${window.location.origin}${window.location.pathname}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link Copied",
      description: "Product link copied to clipboard."
    })
  }

  const handleDownload = (fileName: string) => {
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
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      <Header />
      
      {/* Breadcrumb */}
      <div className="relative z-10 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb />
        </div>
      </div>
      
      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-slate-500">
            <span>Home</span> / <span>Products</span> / <span>{product.category}</span> / <span className="text-blue-600 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-6" ref={galleryRef}>
            <div 
              className="relative rounded-2xl border border-slate-100 overflow-hidden shadow-2xl bg-white p-8"
            >
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-[500px] object-contain transition-transform duration-500 hover:scale-105"
                data-testid="product-main-image"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm min-h-[44px] min-w-[44px] rounded-full border-slate-200 hover:bg-white hover:text-blue-600"
                    onClick={handlePreviousImage}
                    data-testid="button-previous-image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm min-h-[44px] min-w-[44px] rounded-full border-slate-200 hover:bg-white hover:text-blue-600"
                    onClick={handleNextImage}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-24 h-24 rounded-xl border-2 overflow-hidden transition-all ${
                      currentImageIndex === index ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'
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
          <div className="space-y-8" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm">{product.series}</Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 px-3 py-1 text-sm">{product.category}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{product.title}</h1>
              <p className="text-slate-500 font-medium mb-4 text-lg">Model: <span className="font-mono text-slate-700">{product.modelNumber}</span></p>
              
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-slate-900">${price.toFixed(2)}</div>
                {originalPrice && (
                  <div className="text-xl text-slate-400 line-through font-medium">${originalPrice.toFixed(2)}</div>
                )}
                {originalPrice && (
                  <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1">
                    Save ${(originalPrice - price).toFixed(2)}
                  </Badge>
                )}
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Badge className={`${stockConfig.color} px-3 py-1 border-0`} variant="outline">
                    {stockConfig.label}
                  </Badge>
                  {product.stockStatus === 'in_stock' && (
                    <span className="text-sm text-green-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Available
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-slate-600 font-medium">Ships in 1-2 business days</span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-slate-600 font-medium">2 years manufacturer warranty</span>
                </div>
              </div>

              <Separator className="my-8 bg-slate-100" />

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <label className="text-base font-semibold text-slate-700">Quantity:</label>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 border border-slate-200">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full hover:bg-white hover:shadow-sm text-slate-600"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-quantity-decrease"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-bold text-slate-900 text-lg" data-testid="text-quantity">{quantity}</span>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full hover:bg-white hover:shadow-sm text-slate-600"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-quantity-increase"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold shadow-lg transition-all hover:-translate-y-0.5"
                    onClick={handleAddToCart}
                    disabled={product.stockStatus === 'out_of_stock'}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 w-14 rounded-full border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 p-0"
                    onClick={handleToggleFavorite}
                    data-testid="button-toggle-favorite"
                  >
                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 w-14 rounded-full border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 p-0"
                    onClick={handleShare}
                    data-testid="button-share"
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-full text-lg h-14" 
                  size="lg" 
                  data-testid="button-request-quote"
                  onClick={() => setLocation('/contact')}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Request Quote
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordions */}
        <div className="mt-20" ref={detailsRef}>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Product Details</h2>
          
          <div className="space-y-6">
            {/* Heat Exchangers: Models Table */}
            {product.category === 'Heat Exchangers' && Array.isArray((specifications as any).models) && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-xl font-bold text-slate-900">Available Models</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-4 border-b border-slate-100 font-semibold text-slate-600">Model</th>
                          <th className="text-left p-4 border-b border-slate-100 font-semibold text-slate-600">Plates</th>
                          <th className="text-left p-4 border-b border-slate-100 font-semibold text-slate-600">Capacity</th>
                          <th className="text-left p-4 border-b border-slate-100 font-semibold text-slate-600">Document</th>
                        </tr>
                      </thead>
                      <tbody>
                        {((specifications as any).models as Array<any>).map((m, idx) => (
                          <tr key={`${m.model}-${idx}`} className="hover:bg-blue-50/30 transition-colors border-b border-slate-50 last:border-0">
                            <td className="p-4 font-mono font-medium text-slate-900">{m.model}</td>
                            <td className="p-4 text-slate-600">{m.plates}</td>
                            <td className="p-4 text-slate-600">{m.capacity}</td>
                            <td className="p-4">
                              {m.document ? (
                                <a className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-200 hover:decoration-blue-600 transition-all" href={m.document} target="_blank" rel="noreferrer">PDF</a>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Technical Specifications */}
            <Collapsible open={openSections.specifications} onOpenChange={() => toggleSection('specifications')}>
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <CollapsibleTrigger className="w-full" data-testid="toggle-specifications">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Technical Specifications
                      </CardTitle>
                      <div className={`bg-white p-1.5 rounded-full shadow-sm border border-slate-100 transition-transform duration-300 ${
                        openSections.specifications ? 'transform rotate-180' : ''
                      }`}>
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {Object.entries(specifications)
                        .filter(([key]) => key !== 'models')
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
                            <span className="font-semibold text-slate-700">{key}:</span>
                            <span className="text-slate-600 text-right font-medium">
                              {typeof value === 'string' || typeof value === 'number' ? value as any : Array.isArray(value) ? value.join(', ') : ''}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Key Features */}
            <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <CollapsibleTrigger className="w-full" data-testid="toggle-features">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Key Features
                      </CardTitle>
                      <div className={`bg-white p-1.5 rounded-full shadow-sm border border-slate-100 transition-transform duration-300 ${
                        openSections.features ? 'transform rotate-180' : ''
                      }`}>
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="bg-white p-1 rounded-full shadow-sm mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="text-slate-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Typical Applications */}
            <Collapsible open={openSections.applications} onOpenChange={() => toggleSection('applications')}>
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <CollapsibleTrigger className="w-full" data-testid="toggle-applications">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-indigo-500" />
                        Typical Applications
                      </CardTitle>
                      <div className={`bg-white p-1.5 rounded-full shadow-sm border border-slate-100 transition-transform duration-300 ${
                        openSections.applications ? 'transform rotate-180' : ''
                      }`}>
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {applications.map((application, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span className="text-slate-700 font-medium">{application}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Documentation & Downloads */}
            <Collapsible open={openSections.downloads} onOpenChange={() => toggleSection('downloads')}>
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <CollapsibleTrigger className="w-full" data-testid="toggle-downloads">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-600" />
                        Documentation & Downloads
                      </CardTitle>
                      <div className={`bg-white p-1.5 rounded-full shadow-sm border border-slate-100 transition-transform duration-300 ${
                        openSections.downloads ? 'transform rotate-180' : ''
                      }`}>
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {downloads.map((download, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="bg-red-50 p-3 rounded-lg">
                              <FileText className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{download.name}</h4>
                              <p className="text-sm text-slate-500 font-medium">{download.type} • {download.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-full"
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

        {/* Related Products - See TODO.md for implementation plan */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Products</h2>
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 mb-6 text-lg">Explore more products in our catalog</p>
            <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-12 px-8">
              <a href="/products">View All Products</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}