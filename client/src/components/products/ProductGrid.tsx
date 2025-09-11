import { useState } from 'react'
import { Grid, List, Filter, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import ProductCard from './ProductCard'
import pressureSwitchImage from '@assets/generated_images/Pressure_switch_product_photo_6632abba.png'
import heatExchangerImage from '@assets/generated_images/Heat_exchanger_product_photo_ba077dc1.png'
import compressorImage from '@assets/generated_images/Refrigeration_compressor_photo_e9d26f6e.png'

// todo: remove mock data - integrate with real product API
const mockProducts = [
  {
    id: 'lf5532-auto',
    title: 'LF5532 Automatic Reset Pressure Switch',
    modelNumber: 'LF5532-AUTO-24V',
    image: pressureSwitchImage,
    price: 89.99,
    originalPrice: 109.99,
    category: 'Pressure Switches',
    series: 'LF55 Series',
    stockStatus: 'in_stock' as const,
    rating: 4.5,
    reviewCount: 24,
    specifications: {
      workingTemp: '-40°C to 120°C',
      pressure: '0.5-16 bar',
      voltage: '24V AC/DC',
      connection: '1/4" NPT'
    }
  },
  {
    id: 'he-plate-20',
    title: 'Plate Heat Exchanger 20 Plates',
    modelNumber: 'PHE-20-STEEL',
    image: heatExchangerImage,
    price: 445.00,
    category: 'Heat Exchangers',
    series: 'PHE Series',
    stockStatus: 'in_stock' as const,
    rating: 4.8,
    reviewCount: 12,
    specifications: {
      workingTemp: '-20°C to 180°C',
      pressure: '10-25 bar',
      connection: '1" NPT'
    }
  },
  {
    id: 'comp-scroll-5hp',
    title: 'Scroll Compressor 5HP R410A',
    modelNumber: 'SC-5HP-R410A',
    image: compressorImage,
    price: 1299.99,
    originalPrice: 1499.99,
    category: 'Refrigeration Components',
    series: 'Scroll Series',
    stockStatus: 'on_order' as const,
    rating: 4.7,
    reviewCount: 8,
    specifications: {
      workingTemp: '-10°C to 65°C',
      voltage: '220V/3Ph/50Hz'
    }
  },
  {
    id: 'lf32-manual',
    title: 'LF32 Manual Reset Pressure Switch',
    modelNumber: 'LF32-MAN-120V',
    image: pressureSwitchImage,
    price: 67.50,
    category: 'Pressure Switches',
    series: 'LF32 Series',
    stockStatus: 'in_stock' as const,
    rating: 4.3,
    reviewCount: 18,
    specifications: {
      workingTemp: '-25°C to 85°C',
      pressure: '0.8-12 bar',
      voltage: '120V AC'
    }
  },
  {
    id: 'he-coaxial-15',
    title: 'Coaxial Heat Exchanger 15kW',
    modelNumber: 'CHE-15KW-CU',
    image: heatExchangerImage,
    price: 289.99,
    category: 'Heat Exchangers',
    series: 'Coaxial Series',
    stockStatus: 'out_of_stock' as const,
    rating: 4.6,
    reviewCount: 15,
    specifications: {
      workingTemp: '-15°C to 120°C',
      pressure: '8-20 bar',
      connection: '3/4" NPT'
    }
  },
  {
    id: 'comp-recip-3hp',
    title: 'Reciprocating Compressor 3HP',
    modelNumber: 'RC-3HP-R134A',
    image: compressorImage,
    price: 899.99,
    category: 'Refrigeration Components',
    series: 'Reciprocating Series',
    stockStatus: 'in_stock' as const,
    rating: 4.4,
    reviewCount: 22,
    specifications: {
      workingTemp: '-15°C to 55°C',
      voltage: '110V/1Ph/60Hz'
    }
  }
]

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest' | 'rating'

export default function ProductGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // todo: remove mock functionality - integrate with real sorting logic
  const handleSort = (value: SortOption) => {
    setSortBy(value)
    console.log('Sort by:', value)
  }

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    console.log('Page change:', page)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }

  const totalProducts = mockProducts.length
  const productsPerPage = 12
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground" data-testid="text-product-count">
            Showing {Math.min((currentPage - 1) * productsPerPage + 1, totalProducts)}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-48" data-testid="select-sort">
              <SortDesc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              data-testid="button-view-grid"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
          Category: Pressure Switches ✕
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
          In Stock ✕
        </Badge>
        <Button variant="ghost" size="sm" className="text-primary">
          Clear all filters
        </Button>
      </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isCompact={viewMode === 'list'}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          data-testid="button-prev-page"
        >
          Previous
        </Button>
        
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? 'default' : 'outline'}
            onClick={() => handlePageChange(i + 1)}
            data-testid={`button-page-${i + 1}`}
          >
            {i + 1}
          </Button>
        ))}
        
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          data-testid="button-next-page"
        >
          Next
        </Button>
      </div>
    </div>
  )
}