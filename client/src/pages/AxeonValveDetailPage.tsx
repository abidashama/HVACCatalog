import { useEffect, useRef } from 'react'
import { useRoute, useLocation } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package, CheckCircle2 } from 'lucide-react'
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
const AXEON_VALVES_URL = '/products?category=Axeon%20Valves'

// Helper function to parse JSON specifications safely
const parseSpecifications = (specs: string | null): Record<string, any> => {
  if (!specs) return {}
  try {
    return JSON.parse(specs)
  } catch {
    return {}
  }
}

// Helper function to convert text to proper title case
const toTitleCase = (str: string): string => {
  // Common acronyms that should stay uppercase
  const acronyms = ['lp', 'hp', 'hvac', 'ac', 'dc', 'ul', 'ce', 'nc', 'no', 'yc']
  
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

export default function AxeonValveDetailPage() {
  const [, params] = useRoute('/axeon-valves/:productId')
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Fetch the specific axeon valve product from API based on the URL parameter
  const productId = params?.productId || 'axeon-rotalockValves'
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
  const categories = specifications.categories || {}
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
            <Button onClick={() => setLocation(AXEON_VALVES_URL)}>
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

  // Group models by category for organized display
  const modelsByCategory: Record<string, Array<any>> = {}
  models.forEach((model) => {
    const categoryKey = model.subcategory || model.category
    if (!modelsByCategory[categoryKey]) {
      modelsByCategory[categoryKey] = []
    }
    modelsByCategory[categoryKey].push(model)
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Axeon Valves', href: AXEON_VALVES_URL },
              { label: toTitleCase(product.title), href: `/axeon-valves/${product.id}` }
            ]}
          />
        </div>
      </div>

      {/* Product Detail Section - Same layout as PressureSwitchDetailPage */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(AXEON_VALVES_URL)}
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
                <Badge variant="outline">Axeon Valves</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{toTitleCase(product.title)}</h1>
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
                High-precision {toTitleCase(product.title).toLowerCase()} designed for industrial HVAC and refrigeration applications. 
                Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card - Matching PressureSwitchDetailPage style */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="space-y-3">
                {specifications.categoryData?.certifications && specifications.categoryData.certifications.length > 0 && (
                  <div className="flex justify-between py-2 border-b items-center">
                    <span className="text-muted-foreground">Certifications</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {specifications.categoryData.certifications.map((cert: string) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Available Models</span>
                  <span className="font-medium">{modelCount} {modelCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Matching PressureSwitchDetailPage style */}
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
              
              {Object.keys(modelsByCategory).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(modelsByCategory).map(([categoryName, categoryModels]) => (
                    <div key={categoryName}>
                      <h3 className="text-lg font-semibold mb-3">{categoryName}</h3>
                      <Table className="premium-specs-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="specs-table-header">Model</TableHead>
                            {categoryModels.some((m) => m.connection) && (
                              <TableHead className="specs-table-header">Connection</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryModels.map((model, index) => (
                            <TableRow key={`${categoryName}-${index}`} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                              <TableCell className="specs-table-cell model-cell">
                                <span className="model-badge">{model.model}</span>
                              </TableCell>
                              {categoryModels.some((m) => m.connection) && (
                                <TableCell className="specs-table-cell">{model.connection || '—'}</TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
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

