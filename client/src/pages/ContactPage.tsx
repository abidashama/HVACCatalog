import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { SEOHead, seoConfigs } from '@/components/seo/SEOHead'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { insertProductInquirySchema, type InsertProductInquiry } from '@shared/schema'

const inquiryTypes = [
  { value: 'product-inquiry', label: 'Product Inquiry' },
  { value: 'technical-support', label: 'Technical Support' },
  { value: 'quote-request', label: 'Quote Request' },
  { value: 'warranty', label: 'Warranty Claim' },
  { value: 'bulk-order', label: 'Bulk Order' },
  { value: 'custom-solution', label: 'Custom Solution' },
  { value: 'general', label: 'General Question' }
]

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone Support',
    primary: '1-800-HVAC-PRO',
    secondary: '(1-800-482-2776)',
    description: 'Speak with our technical experts',
    hours: 'Mon-Fri: 7:00 AM - 7:00 PM ET',
    badge: '24/7 Emergency Support'
  },
  {
    icon: Mail,
    title: 'Email Support',
    primary: 'sales@industrialhvac.com',
    secondary: 'support@industrialhvac.com',
    description: 'Send detailed technical inquiries',
    hours: 'Response within 2 hours',
    badge: 'Technical Documentation'
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    primary: '1234 Equipment Drive',
    secondary: 'Industrial City, IC 12345',
    description: 'Visit our technical center',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM ET',
    badge: 'Product Demonstrations'
  }
]

const businessHours = [
  { day: 'Monday - Friday', hours: '7:00 AM - 7:00 PM ET', type: 'regular' },
  { day: 'Saturday', hours: '9:00 AM - 3:00 PM ET', type: 'limited' },
  { day: 'Sunday', hours: 'Emergency Support Only', type: 'emergency' },
  { day: 'Holidays', hours: 'Emergency Support Only', type: 'emergency' }
]

const departments = [
  {
    title: 'Sales Department',
    phone: '1-800-482-2776 ext. 1',
    email: 'sales@industrialhvac.com',
    description: 'Product inquiries, quotes, and orders'
  },
  {
    title: 'Technical Support',
    phone: '1-800-482-2776 ext. 2',
    email: 'support@industrialhvac.com',
    description: 'Installation help and troubleshooting'
  },
  {
    title: 'Engineering Services',
    phone: '1-800-482-2776 ext. 3',
    email: 'engineering@industrialhvac.com',
    description: 'Custom solutions and consulting'
  },
  {
    title: 'Customer Service',
    phone: '1-800-482-2776 ext. 4',
    email: 'service@industrialhvac.com',
    description: 'Orders, shipping, and general inquiries'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    subject: '',
    message: '',
    urgency: 'normal'
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Contact form submission mutation
  const contactMutation = useMutation({
    mutationFn: async (data: InsertProductInquiry) => {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit inquiry')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "We'll respond to your inquiry within 2 hours during business hours.",
      })
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        subject: '',
        message: '',
        urgency: 'normal'
      })
    },
    onError: (error) => {
      console.error('Contact form submission error:', error)
      toast({
        title: "Error Sending Message",
        description: "Please try again or call us directly at 1-800-HVAC-PRO.",
        variant: "destructive"
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Map contact form data to inquiry schema
    const inquiryData: InsertProductInquiry = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      company: formData.company || undefined,
      phone: formData.phone || undefined,
      message: `Subject: ${formData.subject}\n\nInquiry Type: ${formData.inquiryType}\n\n${formData.message}`,
      // No productId for general contact form submissions
    }
    
    // Validate the data before submission
    try {
      insertProductInquirySchema.parse(inquiryData)
      contactMutation.mutate(inquiryData)
    } catch (error) {
      toast({
        title: "Form Validation Error",
        description: "Please check all required fields and try again.",
        variant: "destructive"
      })
    }
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.inquiryType && formData.subject && formData.message

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
            Contact Our HVAC Experts
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Get technical support, product information, or custom solutions from our certified HVAC professionals. 
            We're here to help with your project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="text-base py-2">
              <CheckCircle className="mr-2 w-4 h-4" />
              2-Hour Response Time
            </Badge>
            <Badge variant="outline" className="text-base py-2">
              <CheckCircle className="mr-2 w-4 h-4" />
              24/7 Emergency Support
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and our technical team will respond within 2 hours during business hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="john.smith@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company/Organization
                    </label>
                    <Input
                      type="text"
                      placeholder="ABC Construction Company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      data-testid="input-company"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Inquiry Type *
                      </label>
                      <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                        <SelectTrigger data-testid="select-inquiry-type">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Urgency Level
                      </label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger data-testid="select-urgency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General Information</SelectItem>
                          <SelectItem value="normal">Normal - Standard Inquiry</SelectItem>
                          <SelectItem value="high">High - Urgent Project</SelectItem>
                          <SelectItem value="emergency">Emergency - System Down</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      data-testid="input-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Please provide detailed information about your requirements, including model numbers, specifications, quantities, or technical questions..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={!isFormValid || contactMutation.isPending}
                    data-testid="button-submit-form"
                  >
                    {contactMutation.isPending ? (
                      <>Sending Message...</>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card key={method.title} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{method.title}</h3>
                        <p className="text-primary font-medium">{method.primary}</p>
                        <p className="text-muted-foreground text-sm mb-2">{method.secondary}</p>
                        <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                        <p className="text-sm font-medium text-foreground mb-2">{method.hours}</p>
                        <Badge variant="outline" className="text-xs">
                          {method.badge}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {businessHours.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between items-center">
                      <span className="text-foreground font-medium">{schedule.day}</span>
                      <span className={`text-sm ${
                        schedule.type === 'emergency' ? 'text-orange-600' :
                        schedule.type === 'limited' ? 'text-yellow-600' :
                        'text-muted-foreground'
                      }`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <strong>Emergency Support:</strong> For urgent system failures and emergency situations, 
                    call our 24/7 emergency line at 1-800-HVAC-PRO and press 9.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Department Directory */}
            <Card>
              <CardHeader>
                <CardTitle>Department Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.title} className="space-y-1">
                      <h4 className="font-semibold text-foreground">{dept.title}</h4>
                      <p className="text-sm text-primary">{dept.phone}</p>
                      <p className="text-sm text-primary">{dept.email}</p>
                      <p className="text-xs text-muted-foreground">{dept.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}