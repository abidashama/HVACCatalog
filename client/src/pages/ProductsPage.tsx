import { useState } from 'react'
import { Filter } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FilterSidebar from '@/components/filters/FilterSidebar'
import ProductGrid from '@/components/products/ProductGrid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ProductsPage() {
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // todo: remove mock functionality - integrate with real search
  const handleSearch = () => {
    console.log('Product search:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-muted py-12 px-4">
        <div className="max-w-7xl mx-auto">
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
                <Filter className="w-4 h-4" />
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
            <FilterSidebar isOpen={true} onClose={() => {}} />
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
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}