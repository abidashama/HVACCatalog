import { useState } from 'react'
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

// todo: remove mock data - integrate with real filter API
const filterData = {
  categories: [
    { id: 'pressure-switches', name: 'Pressure Switches', count: 156 },
    { id: 'heat-exchangers', name: 'Heat Exchangers', count: 89 },
    { id: 'refrigeration', name: 'Refrigeration Components', count: 234 },
    { id: 'hvac-controls', name: 'HVAC Controls', count: 178 },
    { id: 'valves', name: 'Valves & Fittings', count: 298 }
  ],
  series: [
    { id: 'lf55', name: 'LF55 Series', count: 45 },
    { id: 'lf32', name: 'LF32 Series', count: 38 },
    { id: 'lfsv-d', name: 'LFSV-D Series', count: 28 },
    { id: 'phe', name: 'PHE Series', count: 22 },
    { id: 'scroll', name: 'Scroll Series', count: 15 }
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

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['pressure-switches'])
  const [selectedSeries, setSelectedSeries] = useState<string[]>([])
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [openSections, setOpenSections] = useState({
    categories: true,
    series: true,
    price: true,
    applications: false,
    certifications: false,
    voltages: false
  })

  // todo: remove mock functionality - integrate with real filter logic
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
    console.log('Category filter changed:', categoryId, checked)
  }

  const handleSeriesChange = (seriesId: string, checked: boolean) => {
    if (checked) {
      setSelectedSeries([...selectedSeries, seriesId])
    } else {
      setSelectedSeries(selectedSeries.filter(id => id !== seriesId))
    }
    console.log('Series filter changed:', seriesId, checked)
  }

  const handleApplicationChange = (appId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, appId])
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== appId))
    }
    console.log('Application filter changed:', appId, checked)
  }

  const handleCertificationChange = (certId: string, checked: boolean) => {
    if (checked) {
      setSelectedCertifications([...selectedCertifications, certId])
    } else {
      setSelectedCertifications(selectedCertifications.filter(id => id !== certId))
    }
    console.log('Certification filter changed:', certId, checked)
  }

  const handleVoltageChange = (voltageId: string, checked: boolean) => {
    if (checked) {
      setSelectedVoltages([...selectedVoltages, voltageId])
    } else {
      setSelectedVoltages(selectedVoltages.filter(id => id !== voltageId))
    }
    console.log('Voltage filter changed:', voltageId, checked)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    console.log('Price range changed:', value)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedSeries([])
    setSelectedApplications([])
    setSelectedCertifications([])
    setSelectedVoltages([])
    setPriceRange([0, 2000])
    console.log('All filters cleared')
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
      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted rounded-md">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky lg:top-4 inset-y-0 left-0 z-50 w-80 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
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
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                      data-testid={`checkbox-category-${category.id}`}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`}
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
                      id={`series-${series.id}`}
                      checked={selectedSeries.includes(series.id)}
                      onCheckedChange={(checked) => 
                        handleSeriesChange(series.id, checked as boolean)
                      }
                      data-testid={`checkbox-series-${series.id}`}
                    />
                    <Label 
                      htmlFor={`series-${series.id}`}
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

          <Separator />

          {/* Applications */}
          <FilterSection 
            title="Applications" 
            isOpen={openSections.applications} 
            onToggle={() => toggleSection('applications')}
          >
            <div className="space-y-3">
              {filterData.applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`app-${app.id}`}
                      checked={selectedApplications.includes(app.id)}
                      onCheckedChange={(checked) => 
                        handleApplicationChange(app.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`app-${app.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {app.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {app.count}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Certifications */}
          <FilterSection 
            title="Certifications" 
            isOpen={openSections.certifications} 
            onToggle={() => toggleSection('certifications')}
          >
            <div className="space-y-3">
              {filterData.certifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-${cert.id}`}
                      checked={selectedCertifications.includes(cert.id)}
                      onCheckedChange={(checked) => 
                        handleCertificationChange(cert.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`cert-${cert.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {cert.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {cert.count}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Voltage Options */}
          <FilterSection 
            title="Voltage" 
            isOpen={openSections.voltages} 
            onToggle={() => toggleSection('voltages')}
          >
            <div className="space-y-3">
              {filterData.voltages.map((voltage) => (
                <div key={voltage.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`voltage-${voltage.id}`}
                      checked={selectedVoltages.includes(voltage.id)}
                      onCheckedChange={(checked) => 
                        handleVoltageChange(voltage.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`voltage-${voltage.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {voltage.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {voltage.count}
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