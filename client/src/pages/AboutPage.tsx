import { Building2, Users, Award, MapPin, Phone, Mail, CheckCircle, Star, Globe, Shield, Zap, Target } from 'lucide-react'
import { useLocation } from 'wouter'
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
  const [, setLocation] = useLocation()
  
  const handleContactUs = () => {
    setLocation('/contact')
  }

  const handleRequestQuote = () => {
    setLocation('/contact')
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
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            About <span className="text-blue-600">Axeon Corporation</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
            At Axeon Corporation, we are dedicated to powering India's refrigeration and HVAC industry 
            with top-quality products and innovative solutions. With a deep understanding of the market 
            and a strong network across the country, we bring world-class technology to meet the dynamic 
            needs of businesses nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              size="lg" 
              onClick={handleContactUs} 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/30 px-8 py-6 rounded-full font-bold transition-all duration-300 text-lg"
              data-testid="button-contact-us"
            >
              Contact Our Team
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleRequestQuote} 
              className="border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 px-8 py-6 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm bg-white/50"
              data-testid="button-request-quote"
            >
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Our Trusted Brands
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              As a trusted trading company, we proudly represent globally renowned brands known for 
              their quality, reliability, and performance.
            </p>
          </div>

          <div className="space-y-12">
            {brands.map((brand, index) => (
              <Card key={brand.name} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-slate-100 bg-white overflow-hidden rounded-2xl relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    <div className="lg:col-span-1">
                      <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-slate-100 text-blue-600 rounded-2xl rotate-3 flex items-center justify-center shadow-inner group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <brand.icon className="w-12 h-12 transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{brand.name}</h3>
                          <p className="text-lg text-blue-600 font-semibold">{brand.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                        {brand.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {brand.certifications && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              <Award className="w-4 h-4 text-blue-500" />
                              Certifications
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {brand.certifications.map((cert) => (
                                <Badge key={cert} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 px-3 py-1 text-xs font-semibold transition-colors border-0">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {brand.specialties && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              <Star className="w-4 h-4 text-blue-500" />
                              Specialties
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {brand.specialties.map((specialty) => (
                                <Badge key={specialty} variant="outline" className="border-slate-200 text-slate-600 px-3 py-1 text-xs font-medium">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {brand.countries && (
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-500" />
                              Global Reach
                            </h4>
                            <p className="text-slate-600 font-medium">{brand.countries}</p>
                          </div>
                        )}
                        
                        {brand.patents && (
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-blue-500" />
                              Innovation
                            </h4>
                            <p className="text-slate-600 font-medium">{brand.patents}</p>
                          </div>
                        )}
                        
                        {brand.experience && (
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                              Experience
                            </h4>
                            <p className="text-slate-600 font-medium">{brand.experience}</p>
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
      <section className="py-24 px-4 bg-slate-50/80 relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why Choose Axeon?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We don't just supply products, we deliver value, reliability, and growth for our clients, 
              helping them achieve operational excellence and success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={item.title} className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm text-center group rounded-2xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/20">
                    <item.icon className="w-8 h-8 transform -rotate-3 group-hover:-rotate-6 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white text-center rounded-2xl overflow-hidden group">
              <div className="h-2 w-full bg-blue-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Building2 className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2">Established</h3>
                <p className="text-lg text-slate-500 font-medium">Trusted trading company serving India's HVAC industry</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white text-center rounded-2xl overflow-hidden group">
              <div className="h-2 w-full bg-cyan-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                  <Globe className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2">Global Reach</h3>
                <p className="text-lg text-slate-500 font-medium">Products trusted in 80+ countries worldwide</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white text-center rounded-2xl overflow-hidden group">
              <div className="h-2 w-full bg-indigo-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2">Nationwide</h3>
                <p className="text-lg text-slate-500 font-medium">Strong network across India with technical support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-5" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Partner with Axeon Corporation
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed font-light">
            Join businesses across India who trust Axeon Corporation for their refrigeration 
            and HVAC equipment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-800 font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-full"
              onClick={handleContactUs}
              data-testid="button-contact-cta"
            >
              <Phone className="mr-2 w-5 h-5" />
              Contact Our Team
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-400 text-blue-100 hover:bg-blue-400/20 hover:text-white hover:border-blue-300 px-8 py-6 text-lg backdrop-blur-sm transition-all duration-300 rounded-full"
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
      <Separator className="bg-slate-200/50" />

      <Footer />
    </div>
  )
}