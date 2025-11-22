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
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation(SCROLL_COMPRESSORS_URL)}
          className="mb-8 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image - Left Side */}
          <div className="space-y-6" ref={galleryRef}>
            <div 
              className="relative rounded-2xl border border-slate-100 overflow-hidden shadow-2xl bg-white p-8"
            >
              <img
                src={productImage}
                alt={categoryData.name}
                className="w-full h-[500px] object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-8" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm">Scroll Compressors</Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 px-3 py-1 text-sm">{categoryData.brand}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{categoryData.name}</h1>
              <p className="text-blue-600 font-medium mb-4 text-lg">
                {totalProductCount} {totalProductCount === 1 ? 'Model' : 'Models'} Available
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    Professional Grade
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                High-efficiency scroll compressors designed for industrial HVAC and refrigeration applications. 
                Available for both chiller and heat pump systems. Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card - Matching ProductDetailPage style */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-white/80 backdrop-blur-sm shadow-sm">
              <h3 className="font-bold text-xl text-slate-900 mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Brand</span>
                  <span className="font-semibold text-slate-900 font-mono">{categoryData.brand}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Applications</span>
                  <span className="font-semibold text-slate-900">Chiller & Heat Pump</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-500 font-medium">Available Models</span>
                  <span className="font-bold text-slate-900">{totalProductCount} {totalProductCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Matching ProductDetailPage style */}
            <div className="space-y-4 pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-full text-lg h-14" 
                size="lg"
                onClick={() => setLocation('/contact')}
              >
                Request Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Product Models Table - Below the main content */}
        <div ref={detailsRef} className="mt-16">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Available Models & Specifications</h2>
              
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

