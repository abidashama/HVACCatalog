import { useState } from 'react'
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react'
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
    primary: '+91 9096354646',
    secondary: 'Direct Line',
    description: 'Speak with our technical experts',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM IST',
    badge: 'Technical Support'
  },
  {
    icon: Mail,
    title: 'Email Support',
    primary: 'axeoncorporation@gmail.com',
    secondary: 'Primary Contact',
    description: 'Send detailed technical inquiries',
    hours: 'Response within 2 hours',
    badge: 'Technical Documentation'
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    primary: 'Axeon Corporation',
    secondary: 'Gajanan Colony, Cs. no. 6629, Old Kupwad Road, Sangli - 416416',
    description: 'Visit our technical center',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM IST',
    badge: 'Product Demonstrations'
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
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Contact Our <span className="text-blue-600">HVAC Experts</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            Get technical support, product information, or custom solutions from our certified HVAC professionals. 
            We're here to help with your project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="text-base py-2 px-4 bg-white/50 backdrop-blur-sm border-blue-200 text-blue-700 rounded-full shadow-sm">
              <CheckCircle className="mr-2 w-4 h-4 text-green-500" />
              2-Hour Response Time
            </Badge>
            <Badge variant="outline" className="text-base py-2 px-4 bg-white/50 backdrop-blur-sm border-blue-200 text-blue-700 rounded-full shadow-sm">
              <CheckCircle className="mr-2 w-4 h-4 text-green-500" />
              24/7 Emergency Support
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="p-8">
                <CardTitle className="text-3xl font-bold text-slate-900">Send Us a Message</CardTitle>
                <p className="text-slate-500 text-lg">
                  Fill out the form below and our technical team will respond within 2 hours during business hours.
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="john.smith@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Company/Organization
                    </label>
                    <Input
                      type="text"
                      placeholder="ABC Construction Company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50"
                      data-testid="input-company"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Inquiry Type *
                      </label>
                      <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                        <SelectTrigger className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50" data-testid="select-inquiry-type">
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Urgency Level
                      </label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50" data-testid="select-urgency">
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50"
                      data-testid="input-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Please provide detailed information about your requirements, including model numbers, specifications, quantities, or technical questions..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      className="rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-50 min-h-[150px]"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1"
                    disabled={!isFormValid || contactMutation.isPending}
                    data-testid="button-submit-form"
                  >
                    {contactMutation.isPending ? (
                      <>Sending Message...</>
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
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
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={method.title} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <method.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{method.title}</h3>
                        <p className="text-blue-600 font-semibold mb-2">{method.primary}</p>
                        <p className="text-slate-500 text-sm mb-1">{method.secondary}</p>
                        <p className="text-slate-600 text-sm mb-3 font-medium">{method.description}</p>
                        <p className="text-sm font-bold text-slate-800 mb-3 bg-slate-100 inline-block px-3 py-1 rounded-full">{method.hours}</p>
                        <div>
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                            {method.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}