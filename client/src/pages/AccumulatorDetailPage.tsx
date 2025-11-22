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
const ACCUMULATOR_URL = '/products?category=Accumulator%2FOil%20Separator%2FLiquid%20Receiver'

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

export default function AccumulatorDetailPage() {
  const [, params] = useRoute('/accumulator/:productId')
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Fetch the specific product from API based on the URL parameter
  const productId = params?.productId || 'accumulator-liquidAccumulator'
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
            <Button onClick={() => setLocation(ACCUMULATOR_URL)}>
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
              { label: 'Accumulator/Oil Separator/Liquid Receiver', href: ACCUMULATOR_URL },
              { label: toTitleCase(product.title), href: `/accumulator/${product.id}` }
            ]}
          />
        </div>
      </div>

      {/* Product Detail Section - Same layout as PressureSwitchDetailPage */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation(ACCUMULATOR_URL)}
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
                alt={product.title}
                className="w-full h-[500px] object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-8" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm">Accumulator/Oil Separator/Liquid Receiver</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{toTitleCase(product.title)}</h1>
              <p className="text-blue-600 font-medium mb-4 text-lg">
                {modelCount} {modelCount === 1 ? 'Model' : 'Models'} Available
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
                High-precision {toTitleCase(product.title).toLowerCase()} designed for industrial HVAC and refrigeration applications. 
                Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card - Matching PressureSwitchDetailPage style */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-white/80 backdrop-blur-sm shadow-sm">
              <h3 className="font-bold text-xl text-slate-900 mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                {specifications.categoryData?.certifications && specifications.categoryData.certifications.length > 0 && (
                  <div className="flex justify-between py-3 border-b border-slate-100 items-center">
                    <span className="text-slate-500 font-medium">Certifications</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {specifications.categoryData.certifications.map((cert: string) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1 bg-slate-50 border-slate-200 text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between py-3">
                  <span className="text-slate-500 font-medium">Available Models</span>
                  <span className="font-bold text-slate-900">{modelCount} {modelCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Matching PressureSwitchDetailPage style */}
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
                            {categoryModels.some((m) => m.volume) && (
                              <TableHead className="specs-table-header">Volume</TableHead>
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
                              {categoryModels.some((m) => m.volume) && (
                                <TableCell className="specs-table-cell">{model.volume || '—'}</TableCell>
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

