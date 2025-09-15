import { Building2, Users, Award, MapPin, Phone, Mail, CheckCircle, Star, Globe, Shield, Zap, Target } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { SEOHead, seoConfigs } from '@/components/seo/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const brands = [
  {
    name: 'Lefoo',
    title: 'Precision & Innovation',
    description: 'Founded in 2000, Lefoo is a global leader in pressure switches, valves, and flow switches. With 130+ patents and a comprehensive list of certifications including ISO9001, ISO16949, ISO45001, ISO14001, CE, UL, CSA, and RoHS. Lefoo products are trusted in 80+ countries worldwide for their innovation, safety, and unmatched reliability.',
    certifications: ['ISO9001', 'ISO16949', 'ISO45001', 'ISO14001', 'CE', 'UL', 'CSA', 'RoHS'],
    countries: '80+ countries',
    patents: '130+ patents',
    icon: Shield
  },
  {
    name: 'Invotech',
    title: 'Excellence in Scroll Technologies',
    description: 'With over 15 years of expertise, Invotech Scroll Technologies specializes in scroll compressors and provides expert technical consulting services. Their advanced solutions cater to a wide range of applications from heat pump water heaters to refrigeration systems, chillers, and air conditioning units, serving customers in 30+ countries.',
    experience: '15+ years',
    countries: '30+ countries',
    specialties: ['Scroll Compressors', 'Heat Pump Water Heaters', 'Refrigeration Systems', 'Chillers', 'Air Conditioning'],
    icon: Zap
  },
  {
    name: 'Axeon',
    title: 'Our Own Premium Line',
    description: 'Our in-house brand, Axeon, delivers a comprehensive range of premium refrigeration and HVAC products. Designed to meet India\'s growing industrial demands, Axeon products combine top-tier quality with competitive pricing. Our dedicated team works closely with clients to deliver customized solutions and exceptional service, ensuring long-term partnerships built on trust and performance.',
    specialties: ['Premium Refrigeration', 'HVAC Products', 'Customized Solutions', 'Competitive Pricing'],
    icon: Target
  }
]

const whyChooseUs = [
  {
    icon: Globe,
    title: 'Global Partnerships',
    description: 'Strategic partnerships with leading international brands to bring world-class technology to India'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Top-tier products at competitive prices, ensuring value without compromising on quality'
  },
  {
    icon: MapPin,
    title: 'Nationwide Reach',
    description: 'Strong distribution network across India with comprehensive technical support'
  },
  {
    icon: Target,
    title: 'Customized Solutions',
    description: 'Tailored solutions designed to match your unique requirements and applications'
  }
]

export default function AboutPage() {
  const handleContactUs = () => {
    window.location.href = '/contact'
  }

  const handleRequestQuote = () => {
    window.location.href = '/contact'
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
      
      {/* Hero Section */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Axeon Corporation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            At Axeon Corporation, we are dedicated to powering India's refrigeration and HVAC industry 
            with top-quality products and innovative solutions. With a deep understanding of the market 
            and a strong network across the country, we bring world-class technology to meet the dynamic 
            needs of businesses nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleContactUs} data-testid="button-contact-us">
              Contact Our Team
            </Button>
            <Button size="lg" variant="outline" onClick={handleRequestQuote} data-testid="button-request-quote">
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Trusted Brands
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              As a trusted trading company, we proudly represent globally renowned brands known for 
              their quality, reliability, and performance.
            </p>
          </div>

          <div className="space-y-12">
            {brands.map((brand, index) => (
              <Card key={brand.name} className="hover-elevate">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                          <brand.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{brand.name}</h3>
                          <p className="text-lg text-primary font-medium">{brand.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {brand.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {brand.certifications && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                              {brand.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                            </div>
                          </div>
                        )}
                        
                        {brand.specialties && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                              {brand.specialties.map((specialty) => (
                                <Badge key={specialty} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {brand.countries && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Global Reach</h4>
                            <p className="text-sm text-muted-foreground">{brand.countries}</p>
                          </div>
                        )}
                        
                        {brand.patents && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Innovation</h4>
                            <p className="text-sm text-muted-foreground">{brand.patents}</p>
                          </div>
                        )}
                        
                        {brand.experience && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Experience</h4>
                            <p className="text-sm text-muted-foreground">{brand.experience}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Axeon?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We don't just supply products, we deliver value, reliability, and growth for our clients, 
              helping them achieve operational excellence and success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={item.title} className="hover-elevate text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8" />
          </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">Established</h3>
                <p className="text-lg text-muted-foreground">Trusted trading company serving India's HVAC industry</p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8" />
                    </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">Global Reach</h3>
                <p className="text-lg text-muted-foreground">Products trusted in 80+ countries worldwide</p>
                </CardContent>
              </Card>
            
            <Card className="hover-elevate text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
          </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">Nationwide</h3>
                <p className="text-lg text-muted-foreground">Strong network across India with technical support</p>
                </CardContent>
              </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner with Axeon Corporation
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join businesses across India who trust Axeon Corporation for their refrigeration 
            and HVAC equipment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
              onClick={handleContactUs}
              data-testid="button-contact-cta"
            >
              <Phone className="mr-2 w-5 h-5" />
              Contact Our Team
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
              onClick={handleRequestQuote}
              data-testid="button-request-quote-cta"
            >
              <Mail className="mr-2 w-5 h-5" />
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