import { MessageSquare, Eye, Star, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useFadeIn, useHoverAnimation } from '@/hooks/useGSAPAnimations'
import { useRef, useState } from 'react'
import InquiryModal from '@/components/modals/InquiryModal'
import type { SelectProduct } from '@shared/schema'

interface ProductCardProps {
  id: string
  title: string
  modelNumber: string
  image: string
  price: number
  originalPrice?: number
  category: string
  series: string
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_order'
  rating: number
  reviewCount: number
  specifications: {
    workingTemp?: string
    pressure?: string
    voltage?: string
    connection?: string
  }
  isCompact?: boolean
}

export default function ProductCard({
  id,
  title,
  modelNumber,
  image,
  price,
  originalPrice,
  category,
  series,
  stockStatus,
  rating,
  reviewCount,
  specifications,
  isCompact = false
}: ProductCardProps) {
  
  const cardRef = useRef<HTMLDivElement>(null)
  useHoverAnimation(cardRef)
  
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)
  
  const productForModal: SelectProduct = {
    id,
    title,
    modelNumber,
    image,
    price: price.toString(),
    originalPrice: originalPrice?.toString() || null,
    category,
    series,
    stockStatus,
    rating: rating.toString(),
    reviewCount,
    specifications: JSON.stringify(specifications),
    description: null,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const handleRequestQuote = () => {
    setInquiryModalOpen(true)
  }

  const handleQuickView = () => {
    console.log('Quick view:', id, title)
  }

  const handleDownload = () => {
    const specData = {
      product: title,
      model: modelNumber,
      category,
      series,
      price: `$${price.toFixed(2)}`,
      specifications
    }
    
    const dataStr = JSON.stringify(specData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${modelNumber}-specifications.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const getStockBadge = () => {
    switch (stockStatus) {
      case 'in_stock':
        return <Badge className="bg-chart-2 text-white">In Stock</Badge>
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>
      case 'on_order':
        return <Badge className="bg-chart-3 text-white">On Order</Badge>
    }
  }

  const savings = originalPrice ? ((originalPrice - price) / originalPrice * 100).toFixed(0) : null

  return (
    <Card ref={cardRef} className="group hover-elevate transition-all duration-300 overflow-hidden h-full flex flex-col" data-testid={`product-card-${id}`}>
      <div className="relative overflow-hidden bg-card">
        <div className="aspect-square p-6 flex items-center justify-center bg-gradient-to-br from-card to-muted">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 hidden md:flex">
          <Button size="icon" variant="secondary" onClick={handleQuickView} data-testid={`button-quickview-${id}`}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleRequestQuote} data-testid={`button-quote-${id}`}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleDownload} data-testid={`button-download-${id}`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <div className="md:hidden absolute top-2 right-2 flex gap-1">
          <Button size="icon" variant="secondary" className="h-11 w-11" onClick={handleRequestQuote} data-testid={`button-mobile-quote-${id}`}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-11 w-11" onClick={handleDownload} data-testid={`button-mobile-download-${id}`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {savings && (
            <Badge className="bg-accent text-accent-foreground">
              -{savings}%
            </Badge>
          )}
          <Badge variant="outline" className="bg-background/90">
            {series}
          </Badge>
        </div>

        <div className="absolute top-2 right-2">
          {getStockBadge()}
        </div>
      </div>

      <CardContent className="p-4 space-y-3 flex-1">
        <div className="text-sm text-muted-foreground font-medium">
          {category}
        </div>
        <div>
          <h3 className="font-semibold text-foreground leading-tight mb-1">
            <a 
              href={`/product/${id}`}
              className="hover:text-accent transition-colors cursor-pointer"
              data-testid={`product-card-title`}
            >
              {title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground font-mono" data-testid={`text-model-${id}`}>
            Model: {modelNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-accent text-accent' : 'text-muted'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        {!isCompact && (
          <div className="space-y-1 text-xs text-muted-foreground">
            {specifications.workingTemp && (
              <div className="flex justify-between">
                <span>Working Temp:</span>
                <span className="font-mono">{specifications.workingTemp}</span>
              </div>
            )}
            {specifications.pressure && (
              <div className="flex justify-between">
                <span>Pressure:</span>
                <span className="font-mono">{specifications.pressure}</span>
              </div>
            )}
            {specifications.voltage && (
              <div className="flex justify-between">
                <span>Voltage:</span>
                <span className="font-mono">{specifications.voltage}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground" data-testid={`text-price-${id}`}>
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">per unit</span>
        </div>

        <InquiryModal 
          product={productForModal}
          defaultOpen={inquiryModalOpen}
          onOpenChange={setInquiryModalOpen}
        />
        
        <Button 
          onClick={handleRequestQuote}
          disabled={stockStatus === 'out_of_stock'}
          size={isCompact ? "sm" : "default"}
          className={`${isCompact ? "text-xs px-3" : ""} h-11 md:h-9`}
          data-testid={`button-quote-${id}`}
        >
          <MessageSquare className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mr-1 md:mr-2`} />
          <span className="hidden sm:inline">Request </span>Quote
        </Button>
      </CardFooter>
    </Card>
  )
}