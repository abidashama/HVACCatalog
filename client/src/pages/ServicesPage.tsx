import { Wrench, Users, BookOpen, Headphones, Shield, Zap, Settings, CheckCircle, ArrowRight, Clock, Award } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import InquiryModal from '@/components/modals/InquiryModal'

const mainServices = [
  {
    icon: Wrench,
    title: 'Technical Support & Troubleshooting',
    description: 'Expert guidance for installation, operation, and troubleshooting of HVAC and refrigeration equipment.',
    features: [
      'Phone and email technical support',
      'Remote diagnostic assistance',
      'Installation guidance and best practices',
      'Equipment troubleshooting and repair advice',
      'System optimization recommendations',
      'Preventive maintenance scheduling'
    ],
    availability: '24/7 Emergency Support',
    responseTime: 'Within 2 hours'
  },
  {
    icon: Users,
    title: 'Engineering Consultation',
    description: 'Custom engineering solutions and design consultation for commercial and industrial HVAC projects.',
    features: [
      'System design and specification',
      'Load calculations and energy analysis',
      'Equipment selection and sizing',
      'Retrofit and upgrade planning',
      'Code compliance consultation',
      'Performance optimization studies'
    ],
    availability: 'Mon-Fri Business Hours',
    responseTime: 'Same day response'
  },
  {
    icon: BookOpen,
    title: 'Training & Education',
    description: 'Comprehensive training programs for technicians, engineers, and facility managers.',
    features: [
      'Product-specific training sessions',
      'Installation and maintenance workshops',
      'Online technical webinars',
      'Certification preparation courses',
      'Custom training programs',
      'Technical documentation library'
    ],
    availability: 'Scheduled Programs',
    responseTime: 'Flexible scheduling'
  },
  {
    icon: Headphones,
    title: 'Customer Support Services',
    description: 'Complete customer service support for orders, warranties, and general inquiries.',
    features: [
      'Order processing and tracking',
      'Warranty claim assistance',
      'Product registration support',
      'Shipping and logistics coordination',
      'Returns and exchanges',
      'Account management services'
    ],
    availability: 'Mon-Fri 7 AM - 7 PM ET',
    responseTime: 'Immediate assistance'
  }
]

const specializedServices = [
  {
    icon: Shield,
    title: 'Warranty & Service Protection',
    description: 'Comprehensive warranty coverage and extended service protection plans for your critical equipment.',
    details: [
      'Extended warranty programs up to 5 years',
      'Preventive maintenance agreements',
      'Priority emergency service response',
      'Replacement part guarantees',
      'Performance monitoring and reporting'
    ]
  },
  {
    icon: Zap,
    title: 'Emergency Response',
    description: '24/7 emergency support for critical system failures and urgent technical issues.',
    details: [
      'Round-the-clock emergency hotline',
      'Expedited parts shipment',
      'Remote diagnostic capabilities',
      'On-site service coordination',
      'Temporary equipment solutions'
    ]
  },
  {
    icon: Settings,
    title: 'Custom Solutions',
    description: 'Tailored engineering solutions for unique applications and specialized requirements.',
    details: [
      'Custom equipment modifications',
      'Specialized control programming',
      'Unique application engineering',
      'Prototype development support',
      'Integration with existing systems'
    ]
  }
]

const industryExpertise = [
  {
    title: 'Commercial HVAC',
    description: 'Office buildings, retail spaces, and commercial facilities',
    applications: ['Office Buildings', 'Retail Stores', 'Restaurants', 'Medical Facilities']
  },
  {
    title: 'Industrial Refrigeration',
    description: 'Food processing, cold storage, and industrial cooling systems',
    applications: ['Food Processing', 'Cold Storage', 'Pharmaceutical', 'Data Centers']
  },
  {
    title: 'Process Cooling',
    description: 'Manufacturing and industrial process temperature control',
    applications: ['Manufacturing', 'Chemical Processing', 'Plastics', 'Electronics']
  },
  {
    title: 'Institutional',
    description: 'Schools, hospitals, and government facility HVAC systems',
    applications: ['Educational', 'Healthcare', 'Government', 'Municipal']
  }
]

const serviceProcess = [
  {
    step: '1',
    title: 'Initial Consultation',
    description: 'We assess your specific requirements and technical challenges to understand your project needs.'
  },
  {
    step: '2',
    title: 'Technical Analysis',
    description: 'Our engineers analyze your system specifications, load requirements, and environmental conditions.'
  },
  {
    step: '3',
    title: 'Solution Design',
    description: 'We develop customized solutions with detailed specifications and implementation recommendations.'
  },
  {
    step: '4',
    title: 'Implementation Support',
    description: 'Ongoing technical support during installation, commissioning, and system optimization.'
  },
  {
    step: '5',
    title: 'Maintenance & Support',
    description: 'Continuous support with preventive maintenance, monitoring, and performance optimization.'
  }
]

export default function ServicesPage() {
  const handleContactService = (serviceName: string) => {
    console.log('Contact for service:', serviceName)
  }

  const handleRequestConsultation = () => {
    console.log('Request consultation')
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
            Professional HVAC Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Comprehensive technical support, engineering consultation, and professional services 
            for HVAC and refrigeration professionals across all industries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleRequestConsultation} data-testid="button-request-consultation">
              Request Consultation
            </Button>
            <InquiryModal 
              trigger={
                <Button size="lg" variant="outline" data-testid="button-emergency-support">
                  24/7 Emergency Support
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional services designed to support HVAC contractors, engineers, and facility managers 
              throughout the entire equipment lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <Card key={service.title} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground mb-2">{service.title}</CardTitle>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{service.availability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{service.responseTime}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleContactService(service.title)}
                      data-testid={`button-contact-${index}`}
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Specialized Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced services for complex applications and critical systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specializedServices.map((service, index) => (
              <Card key={service.title} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Industry Expertise
            </h2>
            <p className="text-lg text-muted-foreground">
              Specialized knowledge across diverse industries and applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryExpertise.map((industry, index) => (
              <Card key={industry.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{industry.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{industry.description}</p>
                  <div className="space-y-2">
                    {industry.applications.map((app) => (
                      <Badge key={app} variant="outline" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Service Process
            </h2>
            <p className="text-lg text-muted-foreground">
              A systematic approach to delivering exceptional technical solutions
            </p>
          </div>

          <div className="space-y-8">
            {serviceProcess.map((phase, index) => (
              <div key={phase.step} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {phase.step}
                  </div>
                  {index < serviceProcess.length - 1 && (
                    <div className="w-px bg-border h-16 mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Expert Support?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Our certified HVAC professionals are standing by to help with your technical challenges, 
            project requirements, and equipment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
              onClick={handleRequestConsultation}
              data-testid="button-consultation-cta"
            >
              Schedule Consultation
            </Button>
            <InquiryModal 
              trigger={
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
                  data-testid="button-contact-expert-cta"
                >
                  Contact an Expert
                </Button>
              }
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}