import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import type { ProductFilters } from '@shared/schema'
import pressureSwitchData from '@/assets/data/pressure-switch.json'
import valveData from '@/assets/data/valves.json'
import pressureTransmitterData from '@/assets/data/pressure_transmitters.json'
import heatExchangerData from '@/assets/data/heat_exchangers.json'
import axeonValveData from '@/assets/data/axeon_valves.json'

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters?: Partial<ProductFilters>
  onFiltersChange?: (filters: Partial<ProductFilters>) => void
}

// Calculate pressure switch product count from JSON
const getPressureSwitchCount = () => {
  const categories: any = pressureSwitchData.categories
  let count = 0
  
  // Count products in each category
  if (categories.pressureSwitches?.products) count += categories.pressureSwitches.products.length
  if (categories.lpHpRefrigerationSwitches?.products) count += categories.lpHpRefrigerationSwitches.products.length
  if (categories.lpHpCombinedSwitches?.products) count += categories.lpHpCombinedSwitches.products.length
  if (categories.smallFixDifferentialSwitches) count += 1 // Single model with multiple ranges
  if (categories.oilDifferentialSwitches?.products) count += categories.oilDifferentialSwitches.products.length
  if (categories.airDifferentialSwitches?.products) count += categories.airDifferentialSwitches.products.length
  
  return count
}

// Calculate valve product count from JSON
const getValveCount = () => {
  const categories: any = valveData.categories
  let count = 0
  
  // Count products in each category
  Object.values(categories).forEach((category: any) => {
    if (category.products) {
      count += category.products.length
    } else if (category.subcategories) {
      Object.values(category.subcategories).forEach((subcategory: any) => {
        if (subcategory.products) {
          count += subcategory.products.length
        }
      })
    }
  })
  
  return count
}

// Calculate pressure transmitter product count from JSON
const getPressureTransmitterCount = () => {
  const categories: any = pressureTransmitterData.categories
  let count = 0
  
  // Count products in each category
  Object.values(categories).forEach((category: any) => {
    if (category.products) {
      count += category.products.length
    }
  })
  
  return count
}

// Heat exchangers are shown as a single aggregated product
const getHeatExchangerCount = () => 1

// Calculate Axeon Valves product count from JSON
const getAxeonValvesCount = () => {
  const categories: any = axeonValveData.categories
  return Object.keys(categories).length // 4 types: rotalock, hand shutoff, angle, solenoid
}

// Filter data that matches backend category names exactly
const filterData = {
  categories: [
    { id: 'Pressure Switches', name: 'Pressure Switches', count: getPressureSwitchCount() },
    { id: 'Valves', name: 'Valves', count: getValveCount() },
    { id: 'Pressure Transmitters', name: 'Pressure Transmitters', count: getPressureTransmitterCount() },
    { id: 'Heat Exchangers', name: 'Heat Exchangers', count: getHeatExchangerCount() },
    { id: 'Axeon Valves', name: 'Axeon Valves', count: getAxeonValvesCount() }
  ]
}

export default function FilterSidebar({ isOpen, onClose, filters = {}, onFiltersChange }: FilterSidebarProps) {
  // Utility to create DOM-safe IDs (remove spaces and special chars)
  const createSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Initialize filters from props
  useEffect(() => {
    if (filters.category) {
      setSelectedCategories([filters.category])
    } else {
      setSelectedCategories([])
    }
  }, [filters])
  
  const [openSections, setOpenSections] = useState({
    categories: true
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


  const clearAllFilters = () => {
    setSelectedCategories([])
    
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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden animate-fade-in" 
          onClick={onClose}
          data-testid="overlay-filter-sidebar"
        />
      )}
      
      {/* Sidebar - Full width on mobile for better usability */}
      <div className={`
        fixed lg:sticky lg:top-4 inset-y-0 left-0 z-30 lg:z-20 w-full max-w-full lg:w-80 lg:max-w-80 bg-card border-r border-border
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
                {selectedCategories.length} {selectedCategories.length === 1 ? 'Category' : 'Categories'}
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
        </div>
      </div>
    </>
  )
}