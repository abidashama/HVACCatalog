import { ArrowRight, Wrench, Thermometer, Gauge, Zap, Droplets, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFadeIn, useStaggerAnimation } from '@/hooks/useGSAPAnimations'

const categories = [
  {
    id: 1,
    name: 'Pressure Switches',
    description: 'Reliable pressure control for HVAC and refrigeration systems',
    icon: Gauge,
    productCount: 156,
    href: '/category/pressure-switches',
    color: 'bg-primary'
  },
  {
    id: 2,
    name: 'Heat Exchangers',
    description: 'Efficient heat transfer solutions for industrial applications',
    icon: Thermometer,
    productCount: 89,
    href: '/category/heat-exchangers',
    color: 'bg-chart-2'
  },
  {
    id: 3,
    name: 'Refrigeration Components',
    description: 'Complete refrigeration system components and parts',
    icon: Settings,
    productCount: 234,
    href: '/category/refrigeration',
    color: 'bg-chart-3'
  },
  {
    id: 4,
    name: 'HVAC Controls',
    description: 'Smart controls and automation for HVAC systems',
    icon: Zap,
    productCount: 178,
    href: '/category/hvac-controls',
    color: 'bg-chart-4'
  },
  {
    id: 5,
    name: 'Valves & Fittings',
    description: 'Premium valves and fittings for fluid control',
    icon: Droplets,
    productCount: 298,
    href: '/category/valves',
    color: 'bg-chart-1'
  },
  {
    id: 6,
    name: 'Tools & Accessories',
    description: 'Professional tools and maintenance accessories',
    icon: Wrench,
    productCount: 145,
    href: '/category/tools',
    color: 'bg-muted'
  }
]

export default function CategoryGrid() {
  // Animation hooks
  const headerRef = useFadeIn(0.6)
  const gridRef = useStaggerAnimation(0.1, 0.5)
  
  // todo: remove mock functionality - integrate with real navigation
  const handleCategoryClick = (href: string, name: string) => {
    console.log('Navigate to category:', href, name)
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the right industrial equipment for your HVAC and refrigeration needs
          </p>
        </div>

        {/* Categories Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="group hover-elevate transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleCategoryClick(category.href, category.name)}
              data-testid={`card-category-${category.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${category.color} text-white`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {category.productCount} products
                    </span>
                    <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium mr-1">Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? We have thousands of specialized components.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleCategoryClick('/products', 'All Products')}>
              View All Products
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
              Request Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}