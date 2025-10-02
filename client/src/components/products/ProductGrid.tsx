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
import pressureSwitchData from '@/assets/data/pressure-switch.json'


type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest' | 'rating'

interface ProductGridProps {
  filters?: Partial<ProductFilters>
  searchQuery?: string
  onFiltersChange?: (filters: Partial<ProductFilters>) => void
  onSearchChange?: (search: string) => void
}

export default function ProductGrid({ filters, searchQuery, onFiltersChange, onSearchChange }: ProductGridProps) {
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
  
  const apiProducts = productsResponse?.products || []

  // Build local products from pressure-switch.json when category is Pressure Switches
  const pressureSwitchProducts = useMemo(() => {
    const baseImage = '/assets/generated_images/Pressure_switch_product_photo_6632abba.png'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (pressureSwitchData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Pressure Switches',
        series: p.series ?? 'LF55 Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      } as SelectProduct)
    }

    const seriesFromModel = (model: string): string => {
      const upper = model.replace(/\s+/g, '').toUpperCase()
      if (upper.startsWith('LF08')) return 'LF08 Series'
      if (upper.startsWith('LF5D')) return 'LF5D Series'
      if (upper.startsWith('LF58')) return 'LF58 Series'
      if (upper.startsWith('LF32')) return 'LF32 Series'
      if (upper.startsWith('LF55') || upper.startsWith('LF55')) return 'LF55 Series'
      return 'LF55 Series'
    }

    const priceFor = (model: string) => {
      const hash = Array.from(model).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
      const base = 70 + (hash % 60)
      return base.toFixed(2)
    }

    // Waterline
    const water = categories.pressureSwitches
    if (water?.products) {
      for (const item of water.products as Array<{model: string, range: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${water.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, connection: water.connection, certification: (water.certifications||[]).join(', ') })
        })
      }
    }

    // LP & HP refrigeration
    const lpHp = categories.lpHpRefrigerationSwitches
    if (lpHp?.products) {
      for (const item of lpHp.products as Array<{model: string, range: string, resetOption?: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${lpHp.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, resetOption: item.resetOption, connection: lpHp.connection, certification: (lpHp.certifications||[]).join(', ') })
        })
      }
    }

    // Combined
    const combined = categories.lpHpCombinedSwitches
    if (combined?.products) {
      for (const item of combined.products as Array<{model: string, range: string, resetOption?: {LP: string, HP: string}}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${combined.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, resetOption: item.resetOption ? JSON.stringify(item.resetOption) : undefined, connection: combined.connection, certification: (combined.certifications||[]).join(', ') })
        })
      }
    }

    // Small fix differential (LF08)
    const smallFix = categories.smallFixDifferentialSwitches
    if (smallFix) {
      const model = (smallFix.model as string) ?? 'LF08'
      const ranges: string[] = [
        ...(smallFix.highPressureRanges?.map((r: any) => r.range) || []),
        ...(smallFix.lowPressureRanges?.map((r: any) => r.range) || [])
      ]
      add({
        id: `${model.toLowerCase()}-cartridge`.replace(/[^a-z0-9]+/g, '-'),
        title: `${smallFix.name} - ${model}`,
        modelNumber: model,
        image: baseImage,
        price: priceFor(model),
        series: seriesFromModel(model),
        specifications: JSON.stringify({ pressure: ranges.join(' | '), connection: smallFix.connection, certification: (smallFix.certifications||[]).join(', '), refrigerants: smallFix.refrigerants })
      })
    }

    // Oil differential (LF5D)
    const oil = categories.oilDifferentialSwitches
    if (oil?.products) {
      for (const item of oil.products as Array<{model: string, range: string, maxOperatingPressureBar?: number}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${oil.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, maxOperatingPressureBar: item.maxOperatingPressureBar, connection: oil.connection, certification: (oil.certifications||[]).join(', ') })
        })
      }
    }

    // Air differential (LF32)
    const air = categories.airDifferentialSwitches
    if (air?.products) {
      for (const item of air.products as Array<{model: string, range: string | string[]}>) {
        const model = item.model as string
        const range = Array.isArray(item.range) ? item.range.join(' | ') : item.range
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${air.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: range, certification: (air.certifications||[]).join(', ') })
        })
      }
    }

    return out
  }, [])

  const isPressureSwitchCategory = (filters?.category || '').toLowerCase() === 'pressure switches'.toLowerCase()

  const products = isPressureSwitchCategory ? pressureSwitchProducts : apiProducts
  const totalProducts = isPressureSwitchCategory ? pressureSwitchProducts.length : (productsResponse?.total || 0)
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary" 
            onClick={() => {
              onFiltersChange?.({})
              onSearchChange?.('')
              setCurrentPage(1)
            }}
            data-testid="button-clear-all-filters-grid"
          >
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
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
            ? 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6'
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