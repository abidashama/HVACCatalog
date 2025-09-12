import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { Filter, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FilterSidebar from '@/components/filters/FilterSidebar'
import ProductGrid from '@/components/products/ProductGrid'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProductFilters } from '@shared/schema'

export default function ProductsPage() {
  const [location, setLocation] = useLocation()
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Partial<ProductFilters>>({})
  
  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const initialFilters: Partial<ProductFilters> = {}
    
    if (urlParams.get('search')) {
      setSearchQuery(urlParams.get('search') || '')
      initialFilters.search = urlParams.get('search') || undefined
    }
    
    if (urlParams.get('category')) {
      initialFilters.category = urlParams.get('category') || undefined
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
      initialFilters.stockStatus = urlParams.get('stockStatus') as any
    }
    
    setFilters(initialFilters)
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
    setFilters(newFilters)
    
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            HVAC & Refrigeration Products
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Professional equipment for contractors, technicians, and engineers
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products, model numbers, specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-16 h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-product-search"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10"
                onClick={handleSearch}
                data-testid="button-product-search"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar 
              isOpen={true} 
              onClose={() => {}} 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Mobile Filter Button */}
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

          {/* Mobile Filter Sidebar */}
          <FilterSidebar 
            isOpen={filterSidebarOpen} 
            onClose={() => setFilterSidebarOpen(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}