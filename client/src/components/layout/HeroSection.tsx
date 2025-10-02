import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Shield, Truck, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { useFadeIn, useStaggerAnimation, useCountAnimation } from '@/hooks/useGSAPAnimations'
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
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [, setLocation] = useLocation()
  
  // Animation refs
  const heroContentRef = useFadeIn(0.8)
  const featuresRef = useStaggerAnimation(0.2, 0.6)
  const statsRef = useRef<HTMLDivElement>(null)

  // Animate stats counters
  useCountAnimation(2500, 2, useRef<HTMLSpanElement>(null))
  useCountAnimation(15, 1.5, useRef<HTMLSpanElement>(null))
  useCountAnimation(25, 2.2, useRef<HTMLSpanElement>(null))
  useCountAnimation(10000, 2.5, useRef<HTMLSpanElement>(null))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleCategoryClick = (category: string) => {
    console.log('Navigate to category:', category)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      {/* Hero Background with Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,150,255,0.15),transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-28 md:py-36 lg:py-44">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div ref={heroContentRef} className="text-white space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">Trusted by 10,000+ Professionals</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1]">
                Professional
                <span className="block bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent">
                  HVAC & Refrigeration
                </span>
                <span className="block">Equipment</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed">
                Discover premium Axeon & Lefoo industrial components with technical precision and reliable performance for your projects.
              </p>
            </div>

            {/* CTA Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl backdrop-blur-sm h-14 text-lg font-bold transition-all hover:scale-105"
                onClick={() => handleCategoryClick('/products')}
                data-testid="button-browse-catalog"
              >
                Browse Catalog
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-14 text-lg font-semibold transition-all hover:scale-105"
                onClick={() => setLocation('/contact')}
                data-testid="button-request-quote"
              >
                Request Quote
              </Button>
            </div>

            {/* Animated Stats */}
            <div className="flex flex-wrap gap-10 pt-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className={`transition-all duration-500 ${
                    index === currentStatIndex ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm font-semibold text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Features */}
          <div ref={featuresRef} className="space-y-5">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-white/20 rounded-xl group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-white flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-white/80 leading-relaxed">{feature.description}</p>
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