import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { Filter, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FilterSidebar from '@/components/filters/FilterSidebar'
import ProductGrid from '@/components/products/ProductGrid'
import ProductCard from '@/components/products/ProductCard'
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProductFilters } from '@shared/schema'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import pressureSwitchData from '@/assets/data/pressure-switch.json'

gsap.registerPlugin(ScrollTrigger)

// Constant for consistent URL encoding
const PRESSURE_SWITCHES_URL = '/products?category=Pressure%20Switches'

interface PressureSwitchSubcategory {
  id: string
  name: string
  description: string
  image: string
  modelNumber: string
  productCount: number
  certifications: string[]
  connection?: string
}

export default function ProductsPage() {
  const [location, setLocation] = useLocation()
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Partial<ProductFilters>>({})
  const [showSubcategories, setShowSubcategories] = useState(false)
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Build subcategories from JSON as product-like objects - directly reading image from JSON
  const subcategories: PressureSwitchSubcategory[] = [
    {
      id: 'waterline',
      name: 'Pressure Switch for Waterline',
      description: 'Professional water line pressure switches with wide pressure ranges',
      image: (pressureSwitchData.categories.pressureSwitches as any).image,
      modelNumber: 'LF55 Series',
      productCount: (pressureSwitchData.categories.pressureSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.pressureSwitches?.certifications || [],
      connection: pressureSwitchData.categories.pressureSwitches?.connection
    },
    {
      id: 'refrigeration',
      name: 'LP & HP Refrigeration Switches',
      description: 'Low and high pressure switches for refrigeration systems',
      image: (pressureSwitchData.categories.lpHpRefrigerationSwitches as any).image,
      modelNumber: 'LF55 Series',
      productCount: (pressureSwitchData.categories.lpHpRefrigerationSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.lpHpRefrigerationSwitches?.certifications || [],
      connection: pressureSwitchData.categories.lpHpRefrigerationSwitches?.connection
    },
    {
      id: 'combined',
      name: 'LP-HP Combined Switches',
      description: 'Combined low and high pressure switch units',
      image: (pressureSwitchData.categories.lpHpCombinedSwitches as any).image,
      modelNumber: 'LF58 Series',
      productCount: (pressureSwitchData.categories.lpHpCombinedSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.lpHpCombinedSwitches?.certifications || [],
      connection: pressureSwitchData.categories.lpHpCombinedSwitches?.connection
    },
    {
      id: 'differential',
      name: 'Small Fix Differential Switches',
      description: 'Cartridge type differential pressure switches',
      image: (pressureSwitchData.categories.smallFixDifferentialSwitches as any).image,
      modelNumber: 'LF08 Series',
      productCount: 1, // Single model with multiple ranges
      certifications: pressureSwitchData.categories.smallFixDifferentialSwitches?.certifications || [],
      connection: pressureSwitchData.categories.smallFixDifferentialSwitches?.connection
    },
    {
      id: 'oil',
      name: 'Oil Differential Switches',
      description: 'Oil differential pressure switches for compressor protection',
      image: (pressureSwitchData.categories.oilDifferentialSwitches as any).image,
      modelNumber: 'LF5D Series',
      productCount: (pressureSwitchData.categories.oilDifferentialSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.oilDifferentialSwitches?.certifications || [],
      connection: pressureSwitchData.categories.oilDifferentialSwitches?.connection
    },
    {
      id: 'air',
      name: 'Air Differential Switches',
      description: 'Air differential pressure switches for HVAC systems',
      image: (pressureSwitchData.categories.airDifferentialSwitches as any).image,
      modelNumber: 'LF32 Series',
      productCount: (pressureSwitchData.categories.airDifferentialSwitches?.products as Array<{model: string, range: string | string[]}>)?.length || 0,
      certifications: pressureSwitchData.categories.airDifferentialSwitches?.certifications || []
    }
  ]
  
  // Parse URL parameters on component mount and when URL changes
  useEffect(() => {
    const parseUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const initialFilters: Partial<ProductFilters> = {}
      
      if (urlParams.get('search')) {
        setSearchQuery(urlParams.get('search') || '')
        initialFilters.search = urlParams.get('search') || undefined
      }
      
      if (urlParams.get('category')) {
        const category = urlParams.get('category') || undefined
        initialFilters.category = category
        // Show subcategories if Pressure Switches is selected
        const isPressureSwitches = category?.trim().toLowerCase() === 'pressure switches'
        setShowSubcategories(isPressureSwitches)
      } else {
        setShowSubcategories(false)
      }
      
      if (urlParams.get('series')) {
        initialFilters.series = urlParams.get('series') || undefined
      }
      
      if (urlParams.get('priceMin')) {
        initialFilters.priceMin = parseFloat(urlParams.get('priceMin') || '0')
      }
      
      if (urlParams.get('priceMax')) {
        initialFilters.priceMax = parseFloat(urlParams.get('priceMax') || '0')
      }
      
      if (urlParams.get('stockStatus')) {
        const status = urlParams.get('stockStatus')
        if (status === 'in_stock' || status === 'low_stock' || status === 'out_of_stock' || status === 'on_order') {
          initialFilters.stockStatus = status
        }
      }
      
      setFilters(initialFilters)
    }
    
    // Parse on mount and location change
    parseUrlParams()
    
    // Listen for browser back/forward navigation
    const handlePopState = () => {
      parseUrlParams()
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [location])
  
  const handleSearch = () => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (searchQuery.trim()) {
      urlParams.set('search', searchQuery.trim())
      setFilters(prev => ({ ...prev, search: searchQuery.trim() }))
    } else {
      urlParams.delete('search')
      setFilters(prev => ({ ...prev, search: undefined }))
    }
    
    // Update URL without navigating
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newUrl)
  }
  
  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    // Reset to page 1 when filters change to prevent empty results
    const filtersWithReset = { ...newFilters, page: 1 }
    setFilters(filtersWithReset)
    
    // Check if Pressure Switches is selected
    const isPressureSwitches = newFilters.category?.trim().toLowerCase() === 'pressure switches'
    setShowSubcategories(isPressureSwitches)
    
    // Update URL parameters
    const urlParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.set(key, value.toString())
      }
    })
    
    if (searchQuery.trim()) {
      urlParams.set('search', searchQuery.trim())
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newUrl)
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
    setLocation(`/pressure-switches/${subcategoryId}`)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch)
    
    // Update URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    
    if (newSearch.trim()) {
      urlParams.set('search', newSearch.trim())
    } else {
      urlParams.delete('search')
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newUrl)
  }

  // GSAP Animations
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )

      // Search bar animation
      gsap.fromTo(searchRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      )

      // Main content animation
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power2.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div ref={heroRef} className="bg-muted py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            HVAC & Refrigeration Products
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Professional equipment for contractors, technicians, and engineers
          </p>
          
          {/* Search Bar */}
          <div ref={searchRef} className="max-w-2xl">
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search products, model numbers, specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-14 h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-product-search"
              />
              <Button 
                size="icon" 
                className="absolute right-2 -translate-x-1/2 h-12 w-12 bg-primary hover:bg-primary/90 z-10"
                onClick={handleSearch}
                data-testid="button-product-search"
              >
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 relative">
          {/* Filter Sidebar - LEFT SIDE - Always visible */}
          <SectionErrorBoundary fallbackTitle="Filters Unavailable">
            <FilterSidebar 
              isOpen={filterSidebarOpen} 
              onClose={() => setFilterSidebarOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </SectionErrorBoundary>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 lg:ml-0">
            {showSubcategories ? (
              /* Subcategory Cards for Pressure Switches - Using ProductCard component */
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Pressure Switch Categories</h2>
                    <p className="text-muted-foreground mt-1">Select a category to view products</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({})
                      setShowSubcategories(false)
                      setLocation('/products')
                    }}
                  >
                    View All Products
                  </Button>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                  {subcategories.map((subcategory) => {
                    return (
                      <ProductCard
                        key={subcategory.id}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Pressure Switches"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/pressure-switches/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                      />
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Regular Product Grid */
              <SectionErrorBoundary 
                fallbackTitle="Products Unavailable"
                fallbackMessage="Unable to load products. Please try refreshing the page."
              >
                <ProductGrid 
                  filters={filters} 
                  searchQuery={searchQuery} 
                  onFiltersChange={handleFiltersChange}
                  onSearchChange={handleSearchChange}
                />
              </SectionErrorBoundary>
            )}
          </div>

          {/* Mobile Filter Button - Always visible */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Button
              onClick={() => setFilterSidebarOpen(true)}
              className="rounded-full shadow-lg h-12 px-6 active-elevate-2"
              data-testid="button-mobile-filter"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}