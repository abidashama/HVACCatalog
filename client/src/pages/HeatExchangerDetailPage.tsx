import { useEffect, useRef } from 'react'
import { useRoute, useLocation } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package, Download } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { type SelectProduct } from '@shared/schema'
import { gsap } from 'gsap'

// Constant for consistent URL encoding
const HEAT_EXCHANGERS_URL = '/products?category=Heat%20Exchangers'

// Helper function to parse JSON specifications safely
const parseSpecifications = (specs: string | null): Record<string, any> => {
  if (!specs) return {}
  try {
    return JSON.parse(specs)
  } catch {
    return {}
  }
}

export default function HeatExchangerDetailPage() {
  const [, params] = useRoute('/heat-exchangers/bphe')
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Fetch the heat exchanger product from API - always fetch the aggregated product
  const productId = 'heat-exchangers-bphe'
  const { data: product, isLoading, error } = useQuery<SelectProduct>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      return response.json()
    },
    enabled: true,
  })

  const specifications = product ? parseSpecifications(product.specifications) : {}
  const models = (specifications.models as Array<any>) || []
  const modelCount = models.length

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    if (!product || !galleryRef.current || !productInfoRef.current || !detailsRef.current) {
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
  }, [product])

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
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Product not found</p>
          <div className="flex justify-center mt-6">
            <Button onClick={() => setLocation(HEAT_EXCHANGERS_URL)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const productImage = product.image

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
          onClick={() => setLocation(HEAT_EXCHANGERS_URL)}
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
                alt={product.title}
                className="w-full h-96 object-contain p-6 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-6" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Heat Exchangers</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-muted-foreground mb-2">
                {modelCount} {modelCount === 1 ? 'Model' : 'Models'} Available
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
                {product.description || 'High-efficiency heat exchangers designed for industrial HVAC and refrigeration applications. Built with durable materials for long-lasting performance in demanding environments.'}
              </p>
            </div>

            {/* Specifications Card */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Available Models</span>
                  <span className="font-medium">{modelCount} {modelCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
              
              {models.length > 0 ? (
                <Table className="premium-specs-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="specs-table-header">Model</TableHead>
                      <TableHead className="specs-table-header">Plates</TableHead>
                      <TableHead className="specs-table-header">Capacity</TableHead>
                      <TableHead className="specs-table-header">Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model, index) => (
                      <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                        <TableCell className="specs-table-cell model-cell">
                          <span className="model-badge">{model.model}</span>
                        </TableCell>
                        <TableCell className="specs-table-cell">{model.plates || '-'}</TableCell>
                        <TableCell className="specs-table-cell">{model.capacity || '-'}</TableCell>
                        <TableCell className="specs-table-cell">
                          {model.document ? (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={model.document}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Download className="w-3 h-3" />
                                PDF
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No models available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

