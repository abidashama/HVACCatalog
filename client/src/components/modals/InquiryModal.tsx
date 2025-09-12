import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, X } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { apiRequest } from '@/lib/queryClient'
import { insertProductInquirySchema, type InsertProductInquiry, type SelectProduct } from '@shared/schema'

interface InquiryModalProps {
  trigger?: React.ReactNode
  product?: SelectProduct | null
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function InquiryModal({ 
  trigger,
  product = null, 
  defaultOpen = false,
  onOpenChange 
}: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Form setup with validation
  const form = useForm<InsertProductInquiry>({
    resolver: zodResolver(insertProductInquirySchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: product 
        ? `I'm interested in learning more about the ${product.title} (Model: ${product.modelNumber}). Please provide additional information including pricing and availability.`
        : 'I would like to request information about your HVAC products and services.',
      productId: product?.id || ''
    }
  })

  // Update form when product changes
  useEffect(() => {
    if (product) {
      form.setValue('productId', product.id)
      form.setValue('message', `I'm interested in learning more about the ${product.title} (Model: ${product.modelNumber}). Please provide additional information including pricing and availability.`)
    } else {
      form.setValue('productId', '')
      form.setValue('message', 'I would like to request information about your HVAC products and services.')
    }
  }, [product, form])

  // Inquiry mutation
  const inquiryMutation = useMutation({
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
        title: 'Inquiry Sent Successfully',
        description: 'We\'ve received your inquiry and will get back to you within 24 hours.',
      })
      
      // Invalidate inquiries cache
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] })
      
      // Reset form and close modal
      form.reset()
      handleOpenChange(false)
    },
    onError: (error: any) => {
      console.error('Inquiry submission error:', error)
      toast({
        title: 'Submission Failed',
        description: 'There was an error sending your inquiry. Please try again or contact us directly.',
        variant: 'destructive'
      })
    }
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
    
    // Reset form when closing
    if (!open) {
      form.reset()
    }
  }

  const onSubmit = (data: InsertProductInquiry) => {
    inquiryMutation.mutate(data)
  }

  const dialogContent = (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-inquiry">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {product ? 'Request Product Quote' : 'Request Information'}
          </DialogTitle>
          <DialogDescription>
            {product 
              ? 'Get detailed pricing and technical specifications for this product'
              : 'Contact our team for product information and technical support'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Product Info (if specific product inquiry) */}
        {product && (
          <div className="bg-muted p-4 rounded-lg space-y-3" data-testid="section-product-info">
            <div className="flex items-start gap-4">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-16 h-16 object-contain rounded-md bg-background"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground leading-tight" data-testid="text-product-title">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground font-mono" data-testid="text-product-model">
                  Model: {product.modelNumber}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{product.series}</Badge>
                  <Badge variant="outline">{product.category}</Badge>
                  <span className="text-lg font-bold text-primary" data-testid="text-product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Smith" 
                        {...field} 
                        data-testid="input-inquiry-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@company.com" 
                        {...field} 
                        data-testid="input-inquiry-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...field} 
                        value={field.value || ''}
                        data-testid="input-inquiry-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ABC Contracting" 
                        {...field} 
                        value={field.value || ''}
                        data-testid="input-inquiry-company"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your requirements, quantities needed, and any technical specifications..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      data-testid="textarea-inquiry-message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden product ID field */}
            <input type="hidden" {...form.register('productId')} />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                disabled={inquiryMutation.isPending}
                data-testid="button-inquiry-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={inquiryMutation.isPending}
                data-testid="button-inquiry-submit"
              >
                {inquiryMutation.isPending ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )

  // If trigger provided, wrap in DialogTrigger, otherwise return Dialog directly
  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild data-testid="trigger-inquiry-modal">
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  return dialogContent
}