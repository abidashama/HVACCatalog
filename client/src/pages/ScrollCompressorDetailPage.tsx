import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { ArrowLeft, Package, Download } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import scrollCompressorData from '@/assets/data/scroll_compressor.json'
import { gsap } from 'gsap'

// Constant for consistent URL encoding
const SCROLL_COMPRESSORS_URL = '/products?category=Scroll%20Compressors'

interface ProductModel {
  model: string
  capacity: string
  refrigerant: string
  document?: string
}

interface SubcategoryData {
  name: string
  products?: ProductModel[]
}

interface CategoryData {
  name: string
  brand: string
  subcategories: {
    chiller: SubcategoryData
    heatPump: SubcategoryData
  }
  image: string
}

export default function ScrollCompressorDetailPage() {
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const categoryData = scrollCompressorData.categories.scrollCompressors as CategoryData

  // Calculate total product count
  const chillerCount = categoryData.subcategories.chiller.products?.length || 0
  const heatPumpCount = categoryData.subcategories.heatPump.products?.length || 0
  const totalProductCount = chillerCount + heatPumpCount

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    if (!galleryRef.current || !productInfoRef.current || !detailsRef.current) {
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
  }, [])

  // Get the image from the category data
  const productImage = categoryData.image

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Scroll Compressors', href: '/scroll-compressors' }
            ]}
          />
        </div>
      </div>

      {/* Product Detail Section - Same layout as ProductDetailPage */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(SCROLL_COMPRESSORS_URL)}
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
                alt={categoryData.name}
                className="w-full h-96 object-contain p-6 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-6" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Scroll Compressors</Badge>
                <Badge variant="outline">{categoryData.brand}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{categoryData.name}</h1>
              <p className="text-muted-foreground mb-2">
                {totalProductCount} {totalProductCount === 1 ? 'Model' : 'Models'} Available
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
                High-efficiency scroll compressors designed for industrial HVAC and refrigeration applications. 
                Available for both chiller and heat pump systems. Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card - Matching ProductDetailPage style */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium font-mono">{categoryData.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-medium">Chiller & Heat Pump</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Available Models</span>
                  <span className="font-medium">{totalProductCount} {totalProductCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Matching ProductDetailPage style */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Request Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Product Models Table - Below the main content */}
        <div ref={detailsRef} className="mt-12">
          <Card className="specs-table-card">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Available Models & Specifications</h2>
              
              {/* Chiller Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Chiller</h3>
                {categoryData.subcategories.chiller.products && Array.isArray(categoryData.subcategories.chiller.products) && (
                  <Table className="premium-specs-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="specs-table-header">Model</TableHead>
                        <TableHead className="specs-table-header">Capacity</TableHead>
                        <TableHead className="specs-table-header">Refrigerant</TableHead>
                        <TableHead className="specs-table-header">Document</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryData.subcategories.chiller.products.map((product: ProductModel, index: number) => (
                        <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                          <TableCell className="specs-table-cell model-cell">
                            <span className="model-badge">{product.model}</span>
                          </TableCell>
                          <TableCell className="specs-table-cell">
                            <span className="font-medium">{product.capacity}</span>
                          </TableCell>
                          <TableCell className="specs-table-cell">
                            <span className="font-mono text-sm">{product.refrigerant}</span>
                          </TableCell>
                          <TableCell className="specs-table-cell">
                            {product.document ? (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={product.document}
                                  download={product.document.split('/').pop()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Heat Pump Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Heat Pump</h3>
                {categoryData.subcategories.heatPump.products && Array.isArray(categoryData.subcategories.heatPump.products) && (
                  <Table className="premium-specs-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="specs-table-header">Model</TableHead>
                        <TableHead className="specs-table-header">Capacity</TableHead>
                        <TableHead className="specs-table-header">Refrigerant</TableHead>
                        <TableHead className="specs-table-header">Document</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryData.subcategories.heatPump.products.map((product: ProductModel, index: number) => (
                        <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                          <TableCell className="specs-table-cell model-cell">
                            <span className="model-badge">{product.model}</span>
                          </TableCell>
                          <TableCell className="specs-table-cell">
                            <span className="font-medium">{product.capacity}</span>
                          </TableCell>
                          <TableCell className="specs-table-cell">
                            <span className="font-mono text-sm">{product.refrigerant}</span>
                          </TableCell>
                          <TableCell className="specs-table-cell">
                            {product.document ? (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={product.document}
                                  download={product.document.split('/').pop()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

