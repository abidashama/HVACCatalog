import Header from '@/components/layout/Header'
import CategoryGrid from '@/components/layout/CategoryGrid'
import Footer from '@/components/layout/Footer'
import BrandShowcase from '@/components/brands/BrandShowcase'
import { SEOHead, seoConfigs } from '@/components/seo/SEOHead'
import { ArrowRight, Shield, Truck, Clock, Award, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ProductCard from '@/components/products/ProductCard'
import { useQuery } from '@tanstack/react-query'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { useLocation } from 'wouter'
import { type SelectProduct } from '@shared/schema'
import pressureSwitchData from '@/assets/data/pressure-switch.json'
import valveData from '@/assets/data/valves.json'
import pressureTransmitterData from '@/assets/data/pressure_transmitters.json'

// Transform backend product data for ProductCard component
const transformProduct = (product: SelectProduct) => {
  let specifications = {}
  
  if (product.specifications) {
    try {
      specifications = JSON.parse(product.specifications)
    } catch (error) {
      console.warn('Failed to parse product specifications:', error)
      specifications = {}
    }
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

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'All products are certified and thoroughly tested to meet industry standards.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $500 with express delivery options available.'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock technical support from certified HVAC professionals.'
  },
  {
    icon: Award,
    title: 'Industry Leader',
    description: '25+ years of experience serving HVAC and refrigeration professionals.'
  }
]

const customerTestimonials = [
  {
    id: 1,
    name: 'Robert Martinez',
    title: 'Senior HVAC Technician',
    company: 'Metro Refrigeration Services',
    content: 'Industrial HVAC has been our go-to supplier for over 8 years. Their Lefoo pressure switches are incredibly reliable, and when we need technical support, their team always delivers expert guidance.',
    rating: 5,
    location: 'Phoenix, AZ',
    projectType: 'Commercial Refrigeration'
  },
  {
    id: 2,
    name: 'Jennifer Chen',
    title: 'Facility Manager',
    company: 'FoodSafe Processing Corp',
    content: 'The plate heat exchangers we purchased exceeded our efficiency expectations. The installation support was outstanding, and the equipment has been running flawlessly for two years.',
    rating: 5,
    location: 'Chicago, IL',
    projectType: 'Food Processing Facility'
  },
  {
    id: 3,
    name: 'David Thompson',
    title: 'Project Engineer',
    company: 'Arctic Industrial Solutions',
    content: 'Fast delivery and exceptional technical documentation. Their engineering team helped us select the perfect compressor for our industrial cooling application. Highly recommended.',
    rating: 5,
    location: 'Denver, CO',
    projectType: 'Industrial Process Cooling'
  }
]

// Use the return shape of transformProduct for strong typing in maps
type ProductCardData = ReturnType<typeof transformProduct>

export default function HomePage() {
  const [, setLocation] = useLocation()

  // Show one category from each type: Pressure Switches, Valves, and Pressure Transmitters
  const featuredCategories = [
    {
      id: 'waterline',
      title: 'Pressure Switch for Waterline',
      modelNumber: 'LF55 Series',
      image: (pressureSwitchData.categories.pressureSwitches as any).image,
      price: 0,
      category: 'Pressure Switches',
      series: 'LF55',
      stockStatus: 'in_stock' as const,
      rating: 4.7,
      reviewCount: (pressureSwitchData.categories.pressureSwitches?.products as Array<any>)?.length || 0,
      specifications: {
        connection: 'G1/4',
        pressure: `${(pressureSwitchData.categories.pressureSwitches?.products as Array<any>)?.length || 0} models available`
      }
    },
    {
      id: 'solenoid-lfsv-d',
      title: 'Solenoid Valve & Coil LFSV-D',
      modelNumber: 'LFSV-D Series',
      image: (valveData.categories.solenoidValvesLFSVD as any).image,
      price: 0,
      category: 'Valves',
      series: 'LFSV-D',
      stockStatus: 'in_stock' as const,
      rating: 4.7,
      reviewCount: Object.values((valveData.categories.solenoidValvesLFSVD as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      specifications: {
        connection: 'Multiple sizes',
        pressure: `${Object.values((valveData.categories.solenoidValvesLFSVD as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0)} models available`
      }
    },
    {
      id: 't2000-series',
      title: 'T2000 Series Pressure Transmitter',
      modelNumber: 'T2000 Series',
      image: (pressureTransmitterData.categories.t2000Series as any).image,
      price: 0,
      category: 'Pressure Transmitters',
      series: 'T2000',
      stockStatus: 'in_stock' as const,
      rating: 4.7,
      reviewCount: (pressureTransmitterData.categories.t2000Series?.products as Array<any>)?.length || 0,
      specifications: {
        output: '4-20 mA',
        pressure: `${(pressureTransmitterData.categories.t2000Series?.products as Array<any>)?.length || 0} models available`
      }
    }
  ]

  const handleCategoryClick = (categoryId: string, categoryType: string) => {
    if (categoryType === 'pressure-switches') {
      setLocation(`/pressure-switches/${categoryId}`)
    } else if (categoryType === 'valves') {
      setLocation(`/valves/${categoryId}`)
    } else if (categoryType === 'pressure-transmitters') {
      setLocation(`/pressure-transmitters/${categoryId}`)
    }
  }

  const handleViewAllProducts = () => {
    setLocation('/products')
  }

  const handleContactUs = () => {
    setLocation('/contact')
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Brand Showcase Hero Section */}
      <BrandShowcase />

      {/* Featured Products Section */}
      <section id="featured-products" className="py-24 px-4 relative overflow-hidden">
        {/* Vivid background for Glassmorphism context */}
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[100px]" />
          <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Featured Products
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover our most popular HVAC and refrigeration components engineered for performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredCategories.map((category, index) => {
              const categoryType = index === 0 ? 'pressure-switches' : index === 1 ? 'valves' : 'pressure-transmitters'
              const linkPath = index === 0 
                ? `/pressure-switches/${category.id}` 
                : index === 1
                ? `/valves/${category.id}`
                : `/pressure-transmitters/${category.id}`
              
              return (
                <div key={category.id} className="h-full">
                  <ProductCard
                    id={category.id}
                    title={category.title}
                    modelNumber={category.modelNumber}
                    image={category.image}
                    price={category.price}
                    category={category.category}
                    series={category.series}
                    stockStatus={category.stockStatus}
                    rating={category.rating}
                    reviewCount={category.reviewCount}
                    specifications={category.specifications}
                    customLink={linkPath}
                    onClick={() => handleCategoryClick(category.id, categoryType)}
                  />
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleViewAllProducts} 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/30 px-8 py-6 rounded-full font-bold transition-all duration-300"
              data-testid="button-view-all-products"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Why Choose Us Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Vivid background for Glassmorphism context (Alternating Pattern) */}
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-cyan-400/15 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-blue-400/15 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why Choose Industrial HVAC?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              We're committed to providing the highest quality equipment and service to HVAC professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/40 bg-white/60 backdrop-blur-xl rounded-2xl group overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-slate-100 text-blue-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-lg">
                    <feature.icon className="w-10 h-10 transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3 h-3" /> Testimonials
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Trusted by HVAC Professionals
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              See what our customers say about our products and service quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-2xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-500 border-slate-100 bg-white h-full flex flex-col rounded-2xl">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <Quote className="w-10 h-10 text-blue-50 fill-current" />
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed mb-8 flex-1 italic font-medium">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-0.5">
                        {testimonial.title}
                      </p>
                      <p className="text-xs font-semibold text-blue-600">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-5" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Need Custom Solutions or <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Technical Support?</span>
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed font-light">
            Our team of certified engineers is ready to help you find the perfect equipment for your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-800 font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-full"
              onClick={handleContactUs}
              data-testid="button-contact-us"
            >
              Contact Our Experts
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-blue-400 text-blue-100 hover:bg-blue-400/20 hover:text-white hover:border-blue-300 px-8 py-6 text-lg backdrop-blur-sm transition-all duration-300 rounded-full"
              onClick={() => setLocation('/contact')}
            >
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}