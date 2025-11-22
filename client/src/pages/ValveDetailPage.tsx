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
import valveData from '@/assets/data/valves.json'
import { gsap } from 'gsap'

// Constant for consistent URL encoding
const VALVES_URL = '/products?category=Valves'

// Helper function to convert text to proper title case
const toTitleCase = (str: string): string => {
  // Common acronyms that should stay uppercase
  const acronyms = ['lp', 'hp', 'hvac', 'ac', 'dc', 'ul', 'ce', 'nc', 'no', 'odf', 'sae', 'mf']
  
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
  connection?: string
  voltage?: string
  power?: string
  refrigerant?: string
  capacity?: string
  type?: string
}

interface Subcategory {
  name: string
  products: ProductModel[]
}

interface ValveCategory {
  name: string
  image: string
  document?: string
  products?: ProductModel[]
  subcategories?: Record<string, Subcategory>
  certifications?: string[]
  connection?: string
  note?: string
}

export default function ValveDetailPage() {
  const [, params] = useRoute('/valves/:categoryId')
  const [, setLocation] = useLocation()
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const productInfoRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const categoryId = params?.categoryId
  const categories = valveData.categories as Record<string, ValveCategory>

  // Map category IDs to data
  const categoryMap: Record<string, ValveCategory> = {
    'solenoid-lfsv-d': categories.solenoidValvesLFSVD,
    'solenoid-lfsv-k': categories.solenoidValvesLFSVK,
    'expansion': categories.expansionValves,
    'expansion-brazing': categories.expansionValvesBrazing,
    'solenoid-lffdf': categories.solenoidValvesLFFDF,
    'bypass': categories.bypassValves,
    'ball': categories.ballValves,
    'flow-switch': categories.flowSwitches,
    'sight-glass': categories.sightGlass
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
            <Button onClick={() => setLocation(VALVES_URL)}>
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

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <Button
          variant="ghost"
          onClick={() => setLocation(VALVES_URL)}
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
                alt={currentCategory.name}
                className="w-full h-[500px] object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-8" ref={productInfoRef}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm">Valves & Controls</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{toTitleCase(currentCategory.name)}</h1>
              <p className="text-blue-600 font-medium mb-4 text-lg">
                {productCount} {productCount === 1 ? 'Model' : 'Models'} Available
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
                High-precision {toTitleCase(currentCategory.name).toLowerCase()} designed for industrial HVAC and refrigeration applications. 
                Built with durable materials for long-lasting performance in demanding environments.
              </p>
            </div>

            {/* Specifications Card */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-white/80 backdrop-blur-sm shadow-sm">
              <h3 className="font-bold text-xl text-slate-900 mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                {currentCategory.connection && (
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Connection Type</span>
                    <span className="font-semibold text-slate-900 font-mono">{currentCategory.connection}</span>
                  </div>
                )}
                {currentCategory.certifications && currentCategory.certifications.length > 0 && (
                  <div className="flex justify-between py-3 border-b border-slate-100 items-center">
                    <span className="text-slate-500 font-medium">Certifications</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {currentCategory.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1 bg-slate-50 border-slate-200 text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentCategory.note && (
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Note</span>
                    <span className="font-medium text-slate-900 text-sm text-right">{currentCategory.note}</span>
                  </div>
                )}
                <div className="flex justify-between py-3">
                  <span className="text-slate-500 font-medium">Available Models</span>
                  <span className="font-bold text-slate-900">{productCount} {productCount === 1 ? 'Model' : 'Models'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-full text-lg h-14" 
                size="lg"
                onClick={() => setLocation('/contact')}
              >
                Request Quote
              </Button>
              {currentCategory.document && (
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-bold rounded-full text-lg h-14 transition-all duration-300 bg-transparent" 
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
                    <Download className="w-5 h-5" />
                    Download Technical Document
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Product Models Table - Below the main content */}
        <div ref={detailsRef} className="mt-16">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Available Models & Specifications</h2>
              
              {/* Handle products array */}
              {currentCategory.products && Array.isArray(currentCategory.products) && (
                <Table className="premium-specs-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="specs-table-header">Model</TableHead>
                      {currentCategory.products.some((p) => p.connection) && (
                        <TableHead className="specs-table-header">Connection</TableHead>
                      )}
                      {currentCategory.products.some((p) => p.refrigerant) && (
                        <TableHead className="specs-table-header">Refrigerant</TableHead>
                      )}
                      {currentCategory.products.some((p) => p.capacity) && (
                        <TableHead className="specs-table-header">Capacity</TableHead>
                      )}
                      {currentCategory.products.some((p) => p.voltage) && (
                        <TableHead className="specs-table-header">Voltage</TableHead>
                      )}
                      {currentCategory.products.some((p) => p.power) && (
                        <TableHead className="specs-table-header">Power</TableHead>
                      )}
                      {currentCategory.products.some((p) => p.type) && (
                        <TableHead className="specs-table-header">Type</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCategory.products.map((product, index) => (
                      <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                        <TableCell className="specs-table-cell model-cell">
                          <span className="model-badge">{product.model}</span>
                        </TableCell>
                        {currentCategory.products!.some((p) => p.connection) && (
                          <TableCell className="specs-table-cell">{product.connection || '-'}</TableCell>
                        )}
                        {currentCategory.products!.some((p) => p.refrigerant) && (
                          <TableCell className="specs-table-cell">{product.refrigerant || '-'}</TableCell>
                        )}
                        {currentCategory.products!.some((p) => p.capacity) && (
                          <TableCell className="specs-table-cell">{product.capacity || '-'}</TableCell>
                        )}
                        {currentCategory.products!.some((p) => p.voltage) && (
                          <TableCell className="specs-table-cell">{product.voltage || '-'}</TableCell>
                        )}
                        {currentCategory.products!.some((p) => p.power) && (
                          <TableCell className="specs-table-cell">{product.power || '-'}</TableCell>
                        )}
                        {currentCategory.products!.some((p) => p.type) && (
                          <TableCell className="specs-table-cell">{product.type || '-'}</TableCell>
                        )}
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
                            {subcategory.products.some((p) => p.connection) && (
                              <TableHead className="specs-table-header">Connection</TableHead>
                            )}
                            {subcategory.products.some((p) => p.voltage) && (
                              <TableHead className="specs-table-header">Voltage</TableHead>
                            )}
                            {subcategory.products.some((p) => p.power) && (
                              <TableHead className="specs-table-header">Power</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subcategory.products.map((product, index) => (
                            <TableRow key={index} className="specs-table-row" style={{'--row-index': index} as React.CSSProperties}>
                              <TableCell className="specs-table-cell model-cell">
                                <span className="model-badge">{product.model}</span>
                              </TableCell>
                              {subcategory.products.some((p) => p.connection) && (
                                <TableCell className="specs-table-cell">{product.connection || '-'}</TableCell>
                              )}
                              {subcategory.products.some((p) => p.voltage) && (
                                <TableCell className="specs-table-cell">{product.voltage || '-'}</TableCell>
                              )}
                              {subcategory.products.some((p) => p.power) && (
                                <TableCell className="specs-table-cell">{product.power || '-'}</TableCell>
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

