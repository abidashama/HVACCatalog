import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Grid, List, Filter, SortDesc, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from './ProductCard'
import type { SelectProduct, ProductFilters } from '@shared/schema'
import { gsap } from 'gsap'

interface ProductGridProps {
  filters?: Partial<ProductFilters>
  searchQuery?: string
}

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest' | 'rating'

export default function ProductGrid({ filters, searchQuery }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Refs for GSAP animations
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Build query parameters for API
  const queryParams = useMemo(() => {
    const params: ProductFilters = {
      page: currentPage,
      limit: 12,
      sortBy,
      ...filters
    }
    
    if (searchQuery?.trim()) {
      params.search = searchQuery.trim()
    }
    
    return params
  }, [currentPage, sortBy, filters, searchQuery])
  
  // Fetch products from API
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/products', queryParams],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString())
        }
      })
      
      const response = await fetch(`/api/products?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000    // 10 minutes
  })
  
  const products = productsResponse?.products || []
  const totalProducts = productsResponse?.total || 0
  const productsPerPage = 12
  const totalPages = Math.ceil(totalProducts / productsPerPage)
  
  // Convert API product data to component props format
  const transformProduct = (product: SelectProduct) => {
    let specifications = {}
    try {
      specifications = product.specifications 
        ? JSON.parse(product.specifications) 
        : {}
    } catch (error) {
      console.warn('Failed to parse product specifications:', error)
      specifications = {}
    }
    
    return {
      id: product.id,
      title: product.title,
      modelNumber: product.modelNumber,
      image: product.image,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
      category: product.category,
      series: product.series,
      stockStatus: product.stockStatus,
      rating: parseFloat(product.rating),
      reviewCount: product.reviewCount,
      specifications
    }
  }

  const handleSort = (value: SortOption) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // GSAP Stagger Animation for product cards
  useEffect(() => {
    if (!isLoading && products.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('[data-testid^="product-card-"]')
      
      // Only animate if we have cards
      if (cards.length > 0) {
        // Set initial state immediately
        gsap.set(cards, { 
          opacity: 0, 
          y: 30,
          scale: 0.9
        })
        
        // Then animate to visible state with stagger
        gsap.to(cards, {
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08, // 80ms delay between each card
          ease: "power2.out",
          delay: 0.1 // Small delay to ensure DOM is ready
        })
      }
    }
  }, [isLoading, products.length])

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground" data-testid="text-product-count">
            {isLoading ? 'Loading products...' : `Showing ${Math.min((currentPage - 1) * productsPerPage + 1, totalProducts)}-${Math.min(currentPage * productsPerPage, totalProducts)} of ${totalProducts} products`}
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
      {(filters?.category || filters?.series || filters?.search || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters?.category && (
            <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
              Category: {filters.category} ✕
            </Badge>
          )}
          {filters?.series && (
            <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
              Series: {filters.series} ✕
            </Badge>
          )}
          {(filters?.search || searchQuery) && (
            <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
              Search: {filters?.search || searchQuery} ✕
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="text-primary">
            Clear all filters
          </Button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert className="mb-6" data-testid="alert-products-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. 
            <Button variant="ghost" onClick={() => refetch()} className="ml-2 p-0 h-auto" data-testid="button-retry-products">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (!isLoading && products.length === 0) ? (
        <div className="text-center py-12" data-testid="message-no-products">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6'
            : 'space-y-4'
        } data-testid="container-products" ref={gridRef}>
          {products.map((product: SelectProduct) => (
            <ProductCard
              key={product.id}
              {...transformProduct(product)}
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
          disabled={currentPage === 1 || isLoading}
          data-testid="button-prev-page"
        >
          Previous
        </Button>
        
        {totalPages > 0 && [...Array(Math.min(totalPages, 10))].map((_, i) => {
          const pageNum = i + 1
          // Show first 5 pages, then ellipsis logic for large page counts
          if (totalPages <= 10 || pageNum <= 5 || pageNum > totalPages - 5 || Math.abs(pageNum - currentPage) <= 2) {
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                onClick={() => handlePageChange(pageNum)}
                disabled={isLoading}
                data-testid={`button-page-${pageNum}`}
              >
                {pageNum}
              </Button>
            )
          }
          return null
        })}
        
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading || totalPages === 0}
          data-testid="button-next-page"
        >
          Next
        </Button>
      </div>
    </div>
  )
}