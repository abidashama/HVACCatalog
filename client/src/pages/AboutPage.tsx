import { Building2, Users, Award, MapPin, Phone, Mail, Calendar, CheckCircle, Star, Quote, Target, TrendingUp, Shield, Globe } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { SEOHead, seoConfigs } from '@/components/seo/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const teamMembers = [
  {
    name: 'Michael Chen',
    position: 'Chief Executive Officer',
    experience: '25+ years HVAC industry experience',
    certifications: ['EPA Universal', 'NATE Certified', 'ASHRAE Member'],
    specializations: ['Commercial Refrigeration', 'Industrial Cooling', 'System Design'],
    education: 'MS Mechanical Engineering, University of California',
    previousRole: 'VP of Engineering at leading HVAC manufacturer',
    description: 'Michael brings decades of hands-on engineering experience to Industrial HVAC Solutions. His expertise in large-scale commercial refrigeration projects has helped countless customers optimize their systems for maximum efficiency and reliability.',
    achievements: ['Led $50M+ commercial cooling projects', 'ASHRAE Distinguished Service Award', 'Published 15+ technical papers'],
    languages: ['English', 'Mandarin']
  },
  {
    name: 'Sarah Rodriguez',
    position: 'Chief Technology Officer',
    experience: '20+ years engineering leadership',
    certifications: ['Professional Engineer (PE)', 'ASHRAE Fellow', 'LEED AP'],
    specializations: ['Energy Efficiency', 'Automated Controls', 'Green Building Systems'],
    education: 'PhD Mechanical Engineering, MIT',
    previousRole: 'Senior Engineering Manager at Fortune 500 manufacturer',
    description: 'Sarah specializes in cutting-edge HVAC technology and energy-efficient design solutions. Her innovative approach to system automation has revolutionized how our customers manage their facilities.',
    achievements: ['30+ patents in HVAC automation', 'LEED Platinum project leader', 'MIT Engineering Excellence Award'],
    languages: ['English', 'Spanish']
  },
  {
    name: 'David Thompson',
    position: 'VP of Sales & Customer Relations',
    experience: '18+ years B2B sales leadership',
    certifications: ['HVAC Excellence Certified', 'Sales Management Institute'],
    specializations: ['Industrial Sales', 'Technical Consultation', 'Customer Solutions'],
    education: 'MBA Business Administration, Northwestern Kellogg',
    previousRole: 'Regional Sales Director at industrial equipment distributor',
    description: 'David combines deep technical knowledge with exceptional customer service skills. His consultative approach ensures customers receive the perfect equipment solutions for their specific applications.',
    achievements: ['$100M+ in equipment sales', 'Customer Service Excellence Award', 'Top 1% sales performance 5 years running'],
    languages: ['English', 'French']
  },
  {
    name: 'Jennifer Liu',
    position: 'Head of Technical Support',
    experience: '15+ years field service',
    certifications: ['RSES Certified', 'EPA Section 608', 'Refrigeration Service Engineers Society'],
    specializations: ['Field Diagnostics', 'Troubleshooting', 'Preventive Maintenance'],
    education: 'BS Mechanical Engineering Technology, Penn State',
    previousRole: 'Senior Field Service Technician at national service provider',
    description: 'Jennifer brings real-world field experience to our technical support team. Her hands-on background means she understands the challenges technicians face and provides practical, actionable solutions.',
    achievements: ['5000+ service calls completed', 'Technician Training Excellence Award', 'Zero-defect installation record'],
    languages: ['English', 'Cantonese']
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
    projectType: 'Commercial Refrigeration',
    projectValue: '$150,000',
    equipmentUsed: 'LF55 Series Pressure Switches, PHE Heat Exchangers'
  },
  {
    id: 2,
    name: 'Jennifer Chen',
    title: 'Facility Manager',
    company: 'FoodSafe Processing Corp',
    content: 'The plate heat exchangers we purchased exceeded our efficiency expectations. The installation support was outstanding, and the equipment has been running flawlessly for two years.',
    rating: 5,
    location: 'Chicago, IL',
    projectType: 'Food Processing Facility',
    projectValue: '$275,000',
    equipmentUsed: 'Industrial Heat Exchangers, Temperature Controls'
  },
  {
    id: 3,
    name: 'David Thompson',
    title: 'Project Engineer',
    company: 'Arctic Industrial Solutions',
    content: 'Fast delivery and exceptional technical documentation. Their engineering team helped us select the perfect compressor for our industrial cooling application. Highly recommended.',
    rating: 5,
    location: 'Denver, CO',
    projectType: 'Industrial Process Cooling',
    projectValue: '$425,000',
    equipmentUsed: 'Scroll Compressors, Control Systems'
  },
  {
    id: 4,
    name: 'Maria Gonzalez',
    title: 'Chief Engineer',
    company: 'Metropolitan Hospital System',
    content: 'Critical healthcare environment requires absolute reliability. Industrial HVAC delivered a flawless HVAC solution with 24/7 support. Patient comfort and safety are never compromised.',
    rating: 5,
    location: 'Miami, FL',
    projectType: 'Healthcare HVAC',
    projectValue: '$890,000',
    equipmentUsed: 'Hospital-Grade Air Handlers, Precision Controls'
  }
]

const caseStudies = [
  {
    id: 1,
    title: 'Large-Scale Food Processing Facility Modernization',
    client: 'National Food Processing Corp',
    challenge: 'Aging refrigeration system causing temperature inconsistencies and high energy costs',
    solution: 'Complete system redesign with Lefoo components and modern controls',
    results: ['35% energy reduction', '99.9% temperature stability', '$180,000 annual savings'],
    timeline: '6 months',
    location: 'Texas',
    equipmentUsed: ['LF55 Pressure Switches', 'PHE Heat Exchangers', 'Variable Speed Drives'],
    image: null
  },
  {
    id: 2,
    title: 'Hospital Critical Environment HVAC Upgrade',
    client: 'Regional Medical Center',
    challenge: 'Outdated HVAC system compromising air quality and patient safety',
    solution: 'Hospital-grade equipment installation with redundant safety systems',
    results: ['100% uptime achieved', 'Meets all healthcare standards', 'Improved patient satisfaction'],
    timeline: '4 months',
    location: 'California',
    equipmentUsed: ['Medical Air Handlers', 'HEPA Filtration', 'Precision Controls'],
    image: null
  }
]

const certifications = [
  {
    title: 'EPA Certified Dealer',
    description: 'Environmental Protection Agency certified for refrigerant handling and equipment sales',
    year: '1998'
  },
  {
    title: 'ASHRAE Corporate Partner',
    description: 'American Society of Heating, Refrigerating and Air-Conditioning Engineers partnership',
    year: '2001'
  },
  {
    title: 'RSES Authorized Distributor',
    description: 'Refrigeration Service Engineers Society approved equipment distributor',
    year: '2003'
  },
  {
    title: 'AHRI Certified Products',
    description: 'Air-Conditioning, Heating, and Refrigeration Institute certified product line',
    year: '2005'
  },
  {
    title: 'UL Listed Equipment',
    description: 'Underwriters Laboratories safety certified equipment exclusively',
    year: '2000'
  },
  {
    title: 'ISO 9001:2015 Quality',
    description: 'International Organization for Standardization quality management certification',
    year: '2018'
  }
]

const milestones = [
  {
    year: '1998',
    title: 'Company Founded',
    description: 'Industrial HVAC Solutions established to serve commercial and industrial customers with premium equipment.'
  },
  {
    year: '2003',
    title: 'Axeon Partnership',
    description: 'Became authorized distributor for Axeon pressure switches and control systems.'
  },
  {
    year: '2007',
    title: 'Technical Center Opens',
    description: 'Opened dedicated technical support and training facility for customer education programs.'
  },
  {
    year: '2012',
    title: 'Lefoo Distribution',
    description: 'Added Lefoo products to our portfolio, expanding heat exchanger and refrigeration component offerings.'
  },
  {
    year: '2018',
    title: 'ISO Certification',
    description: 'Achieved ISO 9001:2015 certification for quality management systems and processes.'
  },
  {
    year: '2024',
    title: 'Digital Innovation',
    description: 'Launched advanced e-commerce platform with enhanced technical specifications and support tools.'
  }
]

export default function AboutPage() {
  const handleContactUs = () => {
    console.log('Navigate to contact page')
  }

  const handleCareers = () => {
    console.log('Navigate to careers page')
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
            About Industrial HVAC Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            For over 25 years, we've been the trusted partner for HVAC and refrigeration professionals, 
            providing premium equipment, technical expertise, and unmatched customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleContactUs} data-testid="button-contact-us">
              Contact Our Team
            </Button>
            <Button size="lg" variant="outline" onClick={handleCareers} data-testid="button-careers">
              Join Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To empower HVAC and refrigeration professionals with the highest quality equipment, 
                comprehensive technical support, and innovative solutions that drive efficiency and 
                reliability in commercial and industrial applications.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Quality First</h3>
                    <p className="text-muted-foreground">Every product meets strict industry standards and undergoes rigorous testing.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Technical Excellence</h3>
                    <p className="text-muted-foreground">Our team provides expert guidance and comprehensive technical support.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Customer Success</h3>
                    <p className="text-muted-foreground">We're committed to your project success from specification to installation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">25+ Years</h3>
                      <p className="text-muted-foreground">Industry Experience</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Established in 1998, serving thousands of contractors, engineers, and technicians worldwide.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">5,000+</h3>
                      <p className="text-muted-foreground">Active Customers</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Trusted by professionals across commercial, industrial, and institutional markets.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">ISO Certified</h3>
                      <p className="text-muted-foreground">Quality Management</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    ISO 9001:2015 certified quality management systems ensuring consistent excellence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Led by industry veterans with decades of combined experience in HVAC, refrigeration, 
              and customer service excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={member.name} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-2">{member.position}</p>
                      <p className="text-sm text-muted-foreground mb-3">{member.experience}</p>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{member.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones in our commitment to serving the HVAC and refrigeration industry
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-px bg-border h-16 mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-primary">{milestone.year}</span>
                    <h3 className="text-xl font-semibold text-foreground">{milestone.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Certifications & Partnerships
            </h2>
            <p className="text-lg text-muted-foreground">
              Industry certifications and partnerships that demonstrate our commitment to quality and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{cert.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{cert.description}</p>
                  <Badge variant="outline">Certified since {cert.year}</Badge>
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
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real testimonials from HVAC professionals who trust our equipment and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.projectType}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div>Project Value: {testimonial.projectValue}</div>
                      <div>Equipment: {testimonial.equipmentUsed}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how we've helped customers achieve their project goals with innovative HVAC solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Case Study
                    </Badge>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{study.location}</div>
                      <div>{study.timeline}</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                  <p className="text-sm font-medium text-primary">{study.client}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-red-500" />
                      Challenge
                    </h4>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-500" />
                      Solution
                    </h4>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      Results
                    </h4>
                    <ul className="space-y-1">
                      {study.results.map((result, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Equipment Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {study.equipmentUsed.map((equipment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner with Industry Leaders
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of satisfied customers who trust Industrial HVAC Solutions 
            for their critical equipment needs.
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
              data-testid="button-request-quote-cta"
            >
              <Mail className="mr-2 w-5 h-5" />
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}