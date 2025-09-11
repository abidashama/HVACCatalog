import { useState, useEffect } from 'react'
import { Search, ArrowRight, Shield, Truck, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import heroImage from '@assets/generated_images/Industrial_HVAC_facility_hero_6fd485c8.png'

const stats = [
  { label: 'Products', value: '2500+' },
  { label: 'Categories', value: '15' },
  { label: 'Years Experience', value: '25+' },
  { label: 'Satisfied Customers', value: '10K+' }
]

const features = [
  { icon: Shield, title: 'Quality Assured', description: 'All products certified and tested' },
  { icon: Truck, title: 'Fast Shipping', description: 'Free shipping on orders over $500' },
  { icon: Award, title: 'Trusted Brands', description: 'Axeon & Lefoo authorized dealer' },
  { icon: Clock, title: '24/7 Support', description: 'Expert technical assistance' }
]

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // todo: remove mock functionality - integrate with real search
  const handleSearch = () => {
    console.log('Hero search triggered:', searchQuery)
  }

  const handleCategoryClick = (category: string) => {
    console.log('Navigate to category:', category)
  }

  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Professional
                <span className="block text-blue-200">HVAC & Refrigeration</span>
                Equipment
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl">
                Discover premium Axeon & Lefoo industrial components with technical precision and reliable performance.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-lg">
              <Input
                type="search"
                placeholder="Search by model, category, or specification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-6 pr-16 text-lg bg-white/95 border-0 text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-2 h-10 w-10"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm"
                onClick={() => handleCategoryClick('/products')}
              >
                Browse Catalog
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm"
                onClick={() => console.log('Request quote clicked')}
              >
                Request Quote
              </Button>
            </div>

            {/* Animated Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className={`text-center transition-all duration-500 ${
                    index === currentStatIndex ? 'scale-110 text-blue-200' : 'text-white/80'
                  }`}
                >
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover-elevate transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}