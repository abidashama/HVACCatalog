import { useState, useEffect } from 'react'
import { useRoute } from 'wouter'
import { Filter, Grid, List, Star } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FilterSidebar from '@/components/filters/FilterSidebar'
import ProductGrid from '@/components/products/ProductGrid'
import ProductCard from '@/components/products/ProductCard'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProductFilters } from '@shared/schema'
import pressureSwitchImage from '@assets/generated_images/Pressure_switch_product_photo_6632abba.png'
import heatExchangerImage from '@assets/generated_images/Heat_exchanger_product_photo_ba077dc1.png'
import compressorImage from '@assets/generated_images/Refrigeration_compressor_photo_e9d26f6e.png'

// Category data and featured products
const categoryData = {
  'pressure-switches': {
    name: 'Pressure Switches',
    description: 'Professional-grade pressure switches for HVAC and refrigeration applications',
    heroText: 'Precise pressure control for commercial and industrial systems',
    productCount: 24,
    subCategories: ['LF55 Series', 'LF32 Series', 'LFSV-D Series'],
    applications: ['Air Compressor Control', 'Refrigeration Protection', 'HVAC Monitoring'],
    keyBenefits: ['Automatic/Manual Reset Options', 'Wide Pressure Ranges', 'IP65 Protection'],
    featuredProducts: [
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
      }
    ]
  },
  'heat-exchangers': {
    name: 'Heat Exchangers',
    description: 'High-efficiency heat exchangers for optimal thermal performance',
    heroText: 'Advanced heat transfer solutions for industrial applications',
    productCount: 18,
    subCategories: ['Plate Heat Exchangers', 'Coaxial Exchangers', 'Shell & Tube'],
    applications: ['Process Heating/Cooling', 'HVAC Systems', 'Industrial Processing'],
    keyBenefits: ['High Thermal Efficiency', 'Compact Design', 'Easy Maintenance'],
    featuredProducts: [
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
      }
    ]
  },
  'refrigeration': {
    name: 'Refrigeration Components',
    description: 'Complete range of refrigeration components for commercial systems',
    heroText: 'Reliable refrigeration solutions for critical applications',
    productCount: 32,
    subCategories: ['Compressors', 'Condensers', 'Evaporators', 'Controls'],
    applications: ['Commercial Refrigeration', 'Cold Storage', 'Food Processing'],
    keyBenefits: ['Energy Efficiency', 'Reliability', 'Environmental Compliance'],
    featuredProducts: [
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
      }
    ]
  }
}

export default function CategoryPage() {
  const [, params] = useRoute('/category/:slug')
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [filters, setFilters] = useState<Partial<ProductFilters>>({})
  
  const slug = params?.slug || 'pressure-switches'
  const category = categoryData[slug as keyof typeof categoryData]

  useEffect(() => {
    if (category) {
      setFilters(prev => ({ ...prev, category: category.name }))
    }
  }, [category, slug])

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The requested category does not exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb />
        </div>
      </div>

      {/* Category Hero Section */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {category.heroText}
              </p>
              <p className="text-muted-foreground mb-6">
                {category.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {category.subCategories.map((subCat) => (
                  <Badge key={subCat} variant="secondary" data-testid={`badge-subcategory-${subCat.toLowerCase().replace(/\s+/g, '-')}`}>
                    {subCat}
                  </Badge>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{category.productCount} products</span> available in this category
              </div>
            </div>
            
            <div className="space-y-4">
              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Key Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {category.applications.map((app) => (
                      <li key={app} className="text-muted-foreground">• {app}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {category.keyBenefits.map((benefit) => (
                      <li key={benefit} className="text-muted-foreground">• {benefit}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {category.featuredProducts.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Products Grid */}
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                All {category.name}
              </h2>
              <p className="text-muted-foreground">
                Browse our complete selection of professional {category.name.toLowerCase()}
              </p>
            </div>
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}