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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Brand Showcase Hero Section */}
      <BrandShowcase />

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our most popular HVAC and refrigeration components
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredCategories.map((category, index) => {
              const categoryType = index === 0 ? 'pressure-switches' : index === 1 ? 'valves' : 'pressure-transmitters'
              const linkPath = index === 0 
                ? `/pressure-switches/${category.id}` 
                : index === 1
                ? `/valves/${category.id}`
                : `/pressure-transmitters/${category.id}`
              
              return (
                <ProductCard
                  key={category.id}
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
              )
            })}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={handleViewAllProducts} data-testid="button-view-all-products">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Industrial HVAC?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the highest quality equipment and service to HVAC professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((feature, index) => (
              <Card key={feature.title} className="text-center hover-elevate">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by HVAC Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers say about our products and service quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-primary mr-3" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-foreground text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {testimonial.company}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {testimonial.projectType}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Custom Solutions or Technical Support?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Our team of certified engineers is ready to help you find the perfect equipment for your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#0086cd] text-white hover:bg-[#0086cd] hover:text-white hover:border-[#0086cd] bg-[#0086cd]/10 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleContactUs}
              data-testid="button-contact-us"
            >
              Contact Our Experts
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#0086cd] text-white hover:bg-[#0086cd] hover:text-white hover:border-[#0086cd] bg-[#0086cd]/10 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setLocation('/contact')}
            >
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <Separator className="bg-primary-foreground/20" />

      <Footer />
    </div>
  )
}