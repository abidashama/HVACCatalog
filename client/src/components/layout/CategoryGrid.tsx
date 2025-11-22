import { ArrowRight, Wrench, Thermometer, Gauge, Zap, Droplets, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
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
    <section className="py-24 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Find the right industrial equipment for your HVAC and refrigeration needs
          </p>
        </div>

        {/* Categories Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="group border-slate-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden rounded-2xl hover:border-blue-100/50"
              onClick={() => handleCategoryClick(category.href, category.name)}
              data-testid={`card-category-${category.id}`}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {category.productCount} products
                    </span>
                    <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                      <span className="mr-1">Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-8 text-lg">
            Can't find what you're looking for? We have thousands of specialized components.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleCategoryClick('/products', 'All Products')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/30 px-8 py-6 rounded-full font-bold transition-all duration-300"
            >
              View All Products
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setLocation('/contact')}
              className="border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 px-8 py-6 rounded-full font-bold text-lg transition-all duration-300"
            >
              Request Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}