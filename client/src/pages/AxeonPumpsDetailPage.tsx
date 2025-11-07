import { useEffect, useRef } from 'react'
import { useRoute, useLocation } from 'wouter'
import { ArrowLeft, CheckCircle2, Package, Download } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import axeonPumpsData from '@/assets/data/axeon_pumps.json'
import { gsap } from 'gsap'

// Constant for consistent URL encoding
const AXEON_PUMPS_URL = '/products?category=Axeon%20Pumps'

// Helper function to convert text to proper title case
const toTitleCase = (str: string): string => {
  // Common acronyms that should stay uppercase
  const acronyms = ['hvac', 'ac', 'dc', 'ul', 'ce', 'hp', 'ss']
  
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      // Keep acronyms in uppercase
      if (acronyms.includes(word)) {
        return word.toUpperCase()
      }
      
      // Keep small words lowercase (unless they're the first word)
      const lowercase = ['for', 'and', 'or', 'the', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'by', '&']
      const isFirstWord = str.split(' ')[0].toLowerCase() === word
      
      if (lowercase.includes(word) && !isFirstWord) {
        return word
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

interface ProductModel {
  model: string
  power?: string
  phase?: string
  voltage?: string
}

interface Subcategory {
  name: string
  products: ProductModel[]
}

interface CategoryData {
  name: string
  image: string
  document?: string
  products?: ProductModel[]
  subcategories?: Record<string, Subcategory>
  note?: string
}

export default function AxeonPumpsDetailPage() {
  const [, params] = useRoute('/axeon-pumps/:categoryId')
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const categoryId = params?.categoryId
  const categories = axeonPumpsData.categories as Record<string, CategoryData>

  // Map category IDs to data
  const categoryMap: Record<string, CategoryData> = {
    'self-priming-pump-ss': categories.selfPrimingPumpSS,
    'multistage-pump': categories.multistagePump
  }

  const currentCategory = categoryId ? categoryMap[categoryId] : null

  useEffect(() => {
    // Scroll to top when component mounts or category changes
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    if (!currentCategory || !galleryRef.current || !productInfoRef.current || !detailsRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        galleryRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      )

      gsap.fromTo(
        productInfoRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
      )

      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' }
      )
    })

    return () => {
      ctx.revert()
    }
  }, [currentCategory])

  // Guard: render fallback if no valid category
  if (!categoryId || !currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Category not found</p>
          <div className="flex justify-center mt-6">
            <Button onClick={() => setLocation(AXEON_PUMPS_URL)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Get the image from the current category data
  const productImage = currentCategory.image

  // Calculate product count
  let productCount = 0
  if (currentCategory.products) {
    productCount = currentCategory.products.length
  } else if (currentCategory.subcategories) {
    productCount = Object.values(currentCategory.subcategories).reduce(
      (total, sub) => total + sub.products.length,
      0
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

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(AXEON_PUMPS_URL)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image - Left Side */}
          <div className="space-y-4" ref={galleryRef}>
            <div 
              className="relative rounded-lg border overflow-hidden shadow-lg"
              style={{ background: 'radial-gradient(circle, white 15%, rgb(221 221 221) 70%)' }}
            >
              <img
                src={productImage}
                alt={currentCategory.name}
                className="w-full h-96 object-contain p-6 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-6" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Axeon Pumps</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{toTitleCase(currentCategory.name)}</h1>
              <p className="text-muted-foreground mb-2">
                {productCount} {productCount === 1 ? 'Model' : 'Models'} Available
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Professional Grade
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                High-quality {toTitleCase(currentCategory.name).toLowerCase()} designed for industrial HVAC and refrigeration applications. 
                Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="space-y-3">
                {currentCategory.note && (
                  <div className="flex flex-col py-2 border-b">
                    <span className="text-muted-foreground mb-1">Note</span>
                    <Badge variant="secondary" className="w-fit">
                      {currentCategory.note}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Available Models</span>
                  <span className="font-medium">{productCount} {productCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Request Quote
              </Button>
              {currentCategory.document && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <a 
                    href={currentCategory.document} 
                    download={currentCategory.document.split('/').pop()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Technical Document
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Product Models Table - Below the main content */}
        <div ref={detailsRef} className="mt-12">
          <Card className="specs-table-card">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Available Models & Specifications</h2>
              
              {/* Handle products array */}
              {currentCategory.products && Array.isArray(currentCategory.products) && (
                <Table className="premium-specs-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="specs-table-header">Model</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCategory.products.map((product, index) => (
                      <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                        <TableCell className="specs-table-cell model-cell">
                          <span className="model-badge">{product.model}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Handle subcategories */}
              {currentCategory.subcategories && (
                <div className="space-y-8">
                  {Object.entries(currentCategory.subcategories).map(([subKey, subcategory]) => (
                    <div key={subKey}>
                      <h3 className="text-lg font-semibold mb-3">{subcategory.name}</h3>
                      <Table className="premium-specs-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="specs-table-header">Model</TableHead>
                            {subcategory.products.some((p) => p.power) && (
                              <TableHead className="specs-table-header">Power</TableHead>
                            )}
                            {subcategory.products.some((p) => p.phase) && (
                              <TableHead className="specs-table-header">Phase</TableHead>
                            )}
                            {subcategory.products.some((p) => p.voltage) && (
                              <TableHead className="specs-table-header">Voltage</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subcategory.products.map((product, index) => (
                            <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                              <TableCell className="specs-table-cell model-cell">
                                <span className="model-badge">{product.model}</span>
                              </TableCell>
                              {subcategory.products.some((p) => p.power) && (
                                <TableCell className="specs-table-cell">{product.power || '-'}</TableCell>
                              )}
                              {subcategory.products.some((p) => p.phase) && (
                                <TableCell className="specs-table-cell">{product.phase || '-'}</TableCell>
                              )}
                              {subcategory.products.some((p) => p.voltage) && (
                                <TableCell className="specs-table-cell">{product.voltage || '-'}</TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

