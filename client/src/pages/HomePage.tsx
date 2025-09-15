import Header from '@/components/layout/Header'
import HeroSection from '@/components/layout/HeroSection'
import CategoryGrid from '@/components/layout/CategoryGrid'
import Footer from '@/components/layout/Footer'
import { SEOHead, seoConfigs } from '@/components/seo/SEOHead'
import { ArrowRight, Shield, Truck, Clock, Award, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ProductCard from '@/components/products/ProductCard'
import { useQuery } from '@tanstack/react-query'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { type SelectProduct } from '@shared/schema'

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

export default function HomePage() {
  // Fetch featured products from backend (first 3 products, sorted by rating)
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', { sortBy: 'rating', limit: 3 }],
    queryFn: async () => {
      const params = new URLSearchParams({
        sortBy: 'rating',
        limit: '3'  // Pass as string since query params are strings
      })
      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch featured products')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const featuredProducts = productsResponse?.products?.map(transformProduct) || []

  const handleViewAllProducts = () => {
    window.location.href = '/products'
  }

  const handleContactUs = () => {
    window.location.href = '/contact'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-16 px-4">
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
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
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
              onClick={() => window.location.href = '/contact'}
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