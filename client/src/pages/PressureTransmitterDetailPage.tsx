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
import pressureTransmitterData from '@/assets/data/pressure_transmitters.json'
import { gsap } from 'gsap'

// Constant for consistent URL encoding
const PRESSURE_TRANSMITTERS_URL = '/products?category=Pressure%20Transmitters'

// Helper function to convert text to proper title case
const toTitleCase = (str: string): string => {
  // Common acronyms that should stay uppercase
  const acronyms = ['lp', 'hp', 'hvac', 'ac', 'dc', 'ul', 'ce', 'nc', 'no', 'ma']
  
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
  range: string
  output: string
}

interface SubcategoryData {
  name: string
  image: string
  document?: string
  products: ProductModel[]
}

export default function PressureTransmitterDetailPage() {
  const [, params] = useRoute('/pressure-transmitters/:subcategoryId')
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const subcategoryId = params?.subcategoryId
  const categories = pressureTransmitterData.categories as Record<string, SubcategoryData>

  // Map subcategory IDs to data
  const subcategoryMap: Record<string, SubcategoryData> = {
    't2000-series': categories.t2000Series,
    't2800-series': categories.t2800Series
  }

  const currentSubcategory = subcategoryId ? subcategoryMap[subcategoryId] : null

  useEffect(() => {
    // Scroll to top when component mounts or subcategory changes
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    if (!currentSubcategory || !galleryRef.current || !productInfoRef.current || !detailsRef.current) {
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
  }, [currentSubcategory])

  // Guard: render fallback if no valid subcategory
  if (!subcategoryId || !currentSubcategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Subcategory not found</p>
          <div className="flex justify-center mt-6">
            <Button onClick={() => setLocation(PRESSURE_TRANSMITTERS_URL)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Get the image from the current subcategory data
  const productImage = currentSubcategory.image

  const productCount = currentSubcategory.products?.length || 1

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb />
        </div>
      </div>

      {/* Product Detail Section - Same layout as ProductDetailPage */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(PRESSURE_TRANSMITTERS_URL)}
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
                alt={currentSubcategory.name}
                className="w-full h-96 object-contain p-6 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-6" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Pressure Transmitters</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{toTitleCase(currentSubcategory.name)}</h1>
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
                High-precision {toTitleCase(currentSubcategory.name).toLowerCase()} designed for industrial HVAC and refrigeration applications. 
                Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card - Matching ProductDetailPage style */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Output Signal</span>
                  <span className="font-medium font-mono">4-20 mA</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Pressure Range</span>
                  <span className="font-medium font-mono">
                    {currentSubcategory.name.includes('T2000') ? '0-6 BAR to 0-600 BAR' : 'Negative 1-0 BAR to 0-600 BAR'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Available Models</span>
                  <span className="font-medium">{productCount} {productCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Matching ProductDetailPage style */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Request Quote
              </Button>
              {currentSubcategory.document && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <a 
                    href={currentSubcategory.document} 
                    download={currentSubcategory.document.split('/').pop()}
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
              {currentSubcategory.products && Array.isArray(currentSubcategory.products) && (
                <Table className="premium-specs-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="specs-table-header">Model</TableHead>
                      <TableHead className="specs-table-header">Range</TableHead>
                      <TableHead className="specs-table-header">Output</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSubcategory.products.map((product: ProductModel, index: number) => (
                      <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                        <TableCell className="specs-table-cell model-cell">
                          <span className="model-badge">{product.model}</span>
                        </TableCell>
                        <TableCell className="specs-table-cell range-cell">
                          <span className="range-text">{product.range}</span>
                        </TableCell>
                        <TableCell className="specs-table-cell">
                          <Badge variant="outline" className="font-mono">
                            {product.output}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
