import { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import type { ProductFilters } from '@shared/schema'

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters?: Partial<ProductFilters>
  onFiltersChange?: (filters: Partial<ProductFilters>) => void
}

// Filter data that matches backend category/series names exactly
const filterData = {
  categories: [
    { id: 'Pressure Switches', name: 'Pressure Switches', count: 1 },
    { id: 'Temperature Sensors', name: 'Temperature Sensors', count: 1 },
    { id: 'Valves', name: 'Valves', count: 1 },
    { id: 'Heat Exchangers', name: 'Heat Exchangers', count: 0 },
    { id: 'Refrigeration Components', name: 'Refrigeration Components', count: 0 }
  ],
  series: [
    { id: 'LF55 Series', name: 'LF55 Series', count: 1 },
    { id: 'TS4000 Series', name: 'TS4000 Series', count: 1 },
    { id: 'VF200 Series', name: 'VF200 Series', count: 1 },
    { id: 'LFSV-D Series', name: 'LFSV-D Series', count: 0 },
    { id: 'PHE Series', name: 'PHE Series', count: 0 }
  ],
  applications: [
    { id: 'refrigeration', name: 'Refrigeration', count: 187 },
    { id: 'hvac', name: 'HVAC', count: 165 },
    { id: 'water-systems', name: 'Water Systems', count: 94 },
    { id: 'industrial', name: 'Industrial Process', count: 76 }
  ],
  certifications: [
    { id: 'ce', name: 'CE Certified', count: 298 },
    { id: 'ul', name: 'UL Listed', count: 245 },
    { id: 'rohs', name: 'RoHS Compliant', count: 189 },
    { id: 'iso', name: 'ISO 9001', count: 156 }
  ],
  voltages: [
    { id: '24v', name: '24V AC/DC', count: 89 },
    { id: '110v', name: '110V AC', count: 76 },
    { id: '220v', name: '220V AC', count: 65 },
    { id: '12v', name: '12V DC', count: 43 }
  ]
}

export default function FilterSidebar({ isOpen, onClose, filters = {}, onFiltersChange }: FilterSidebarProps) {
  // Utility to create DOM-safe IDs (remove spaces and special chars)
  const createSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSeries, setSelectedSeries] = useState<string[]>([])
  // Removed unused filter states for applications, certifications, voltages
  // These are not implemented in the backend yet
  const [priceRange, setPriceRange] = useState([0, 2000])
  
  // Initialize filters from props
  useEffect(() => {
    if (filters.category) {
      setSelectedCategories([filters.category])
    } else {
      setSelectedCategories([])
    }
    
    if (filters.series) {
      setSelectedSeries([filters.series])
    } else {
      setSelectedSeries([])
    }
    
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      setPriceRange([
        filters.priceMin || 0,
        filters.priceMax || 2000
      ])
    }
    
    if (filters.stockStatus) {
      // Handle stock status if needed
    }
  }, [filters])
  const [openSections, setOpenSections] = useState({
    categories: true,
    series: true,
    price: true
  })

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) { // lg breakpoint
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const applyFilters = () => {
    if (!onFiltersChange) return
    
    const newFilters: Partial<ProductFilters> = {
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      series: selectedSeries.length > 0 ? selectedSeries[0] : undefined,
      priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: priceRange[1] < 2000 ? priceRange[1] : undefined,
    }
    
    onFiltersChange(newFilters)
  }
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newCategories: string[]
    if (checked) {
      newCategories = [categoryId] // Only allow single category selection
    } else {
      newCategories = selectedCategories.filter(id => id !== categoryId)
    }
    setSelectedCategories(newCategories)
    
    // Apply filter immediately
    if (onFiltersChange) {
      const newFilters: Partial<ProductFilters> = {
        ...filters,
        category: newCategories.length > 0 ? categoryId : undefined
      }
      onFiltersChange(newFilters)
    }
  }

  const handleSeriesChange = (seriesId: string, checked: boolean) => {
    let newSeries: string[]
    if (checked) {
      newSeries = [seriesId] // Only allow single series selection
    } else {
      newSeries = selectedSeries.filter(id => id !== seriesId)
    }
    setSelectedSeries(newSeries)
    
    // Apply filter immediately
    if (onFiltersChange) {
      const newFilters: Partial<ProductFilters> = {
        ...filters,
        series: newSeries.length > 0 ? seriesId : undefined
      }
      onFiltersChange(newFilters)
    }
  }

  // Removed unused filter handlers for applications, certifications, voltages
  // These will be added when backend support is implemented

  // Debounce timeout ref to prevent memory leaks
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null)

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    
    // Clear existing timeout to prevent memory leaks
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current)
    }
    
    // Debounce price range changes with proper cleanup
    priceDebounceRef.current = setTimeout(() => {
      if (onFiltersChange) {
        const newFilters: Partial<ProductFilters> = {
          ...filters,
          priceMin: value[0] > 0 ? value[0] : undefined,
          priceMax: value[1] < 2000 ? value[1] : undefined
        }
        onFiltersChange(newFilters)
      }
    }, 300) // Reduced debounce time for better UX
  }

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current)
      }
    }
  }, [])

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedSeries([])
    setPriceRange([0, 2000])
    
    if (onFiltersChange) {
      onFiltersChange({})
    }
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const FilterSection = ({ 
    title, 
    isOpen, 
    onToggle, 
    children 
  }: { 
    title: string
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger 
        className="flex w-full items-center justify-between p-3 hover:bg-muted rounded-md transition-colors relative z-10"
        data-testid={`toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="transition-transform duration-200">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" data-collapsible="content">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden animate-fade-in" 
          onClick={onClose}
          data-testid="overlay-filter-sidebar"
        />
      )}
      
      {/* Sidebar - Full width on mobile for better usability */}
      <div className={`
        fixed lg:sticky lg:top-4 inset-y-0 left-0 z-[60] w-full max-w-full lg:w-80 lg:max-w-80 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} data-testid="sidebar-filters">
        <div className="p-6 space-y-6">
          {/* Header - Larger close button on mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearAllFilters()
                  // Also close sidebar on mobile after clearing
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }} 
                className="h-11 md:h-8"
                data-testid="button-clear-all-filters"
              >
                Clear All
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="lg:hidden h-11 w-11"
                data-testid="button-close-sidebar"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="flex flex-wrap gap-2">
            {selectedCategories.length > 0 && (
              <Badge variant="secondary">
                {selectedCategories.length} Categories
              </Badge>
            )}
            {selectedSeries.length > 0 && (
              <Badge variant="secondary">
                {selectedSeries.length} Series
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Badge variant="secondary">
                Price Range
              </Badge>
            )}
          </div>

          <Separator />

          {/* Categories */}
          <FilterSection 
            title="Categories" 
            isOpen={openSections.categories} 
            onToggle={() => toggleSection('categories')}
          >
            <div className="space-y-3">
              {filterData.categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${createSlug(category.id)}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                      data-testid={`checkbox-category-${category.id}`}
                    />
                    <Label 
                      htmlFor={`category-${createSlug(category.id)}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Series */}
          <FilterSection 
            title="Product Series" 
            isOpen={openSections.series} 
            onToggle={() => toggleSection('series')}
          >
            <div className="space-y-3">
              {filterData.series.map((series) => (
                <div key={series.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`series-${createSlug(series.id)}`}
                      checked={selectedSeries.includes(series.id)}
                      onCheckedChange={(checked) => 
                        handleSeriesChange(series.id, checked as boolean)
                      }
                      data-testid={`checkbox-series-${series.id}`}
                    />
                    <Label 
                      htmlFor={`series-${createSlug(series.id)}`}
                      className="text-sm cursor-pointer"
                    >
                      {series.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {series.count}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Price Range */}
          <FilterSection 
            title="Price Range" 
            isOpen={openSections.price} 
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={2000}
                step={10}
                className="w-full"
                data-testid="slider-price-range"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </FilterSection>

          {/* Unused filter sections (applications, certifications, voltages) removed
               These will be added when backend support is implemented */}
        </div>
      </div>
    </>
  )
}