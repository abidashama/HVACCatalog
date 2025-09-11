import Header from '@/components/layout/Header'
import HeroSection from '@/components/layout/HeroSection'
import CategoryGrid from '@/components/layout/CategoryGrid'
import Footer from '@/components/layout/Footer'
import { ArrowRight, Shield, Truck, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ProductCard from '@/components/products/ProductCard'
import pressureSwitchImage from '@assets/generated_images/Pressure_switch_product_photo_6632abba.png'
import heatExchangerImage from '@assets/generated_images/Heat_exchanger_product_photo_ba077dc1.png'
import compressorImage from '@assets/generated_images/Refrigeration_compressor_photo_e9d26f6e.png'

// todo: remove mock data - integrate with real featured products API
const featuredProducts = [
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
  },
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
  },
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

export default function HomePage() {
  // todo: remove mock functionality - integrate with real navigation
  const handleViewAllProducts = () => {
    console.log('Navigate to products page')
  }

  const handleContactUs = () => {
    console.log('Navigate to contact page')
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
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
              onClick={handleContactUs}
              data-testid="button-contact-us"
            >
              Contact Our Experts
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
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