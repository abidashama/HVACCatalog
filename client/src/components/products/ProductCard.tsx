import { MessageSquare, Eye, Star, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useFadeIn, useHoverAnimation } from '@/hooks/useGSAPAnimations'
import { useRef } from 'react'
import { useLocation } from 'wouter'
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
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order'
  rating: number
  reviewCount: number
  specifications: {
    workingTemp?: string
    pressure?: string
    voltage?: string
    connection?: string
  }
  isCompact?: boolean
  customLink?: string // Optional custom link for special routing
  onClick?: () => void // Optional click handler for custom behavior
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
  isCompact = false,
  customLink,
  onClick
}: ProductCardProps) {
  
  const cardRef = useRef<HTMLDivElement>(null)
  const [, setLocation] = useLocation()
  useHoverAnimation(cardRef)
  
  const productLink = customLink || `/product/${id}`
  
  
  const handleRequestQuote = () => {
    setLocation('/contact')
  }

  const handleQuickView = () => {
    // Quick view functionality - see TODO.md for implementation plan
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

  return (
    <Card 
      ref={cardRef} 
      className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col bg-card rounded-xl" 
      data-testid={`product-card-${id}`}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F5F6F8] via-white to-[#F5F6F8]">
        <div className="aspect-square p-8 flex items-center justify-center relative">
          {/* Background pattern with brand colors */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,174,239,0.05),rgba(255,255,255,0))]" />
          
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 relative z-10 drop-shadow-lg"
          />
        </div>
        
        {/* Hover overlay with actions - Desktop with Navy Blue */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002C5C]/95 via-[#002C5C]/85 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8 gap-3 hidden md:flex">
          <Button size="icon" className="bg-[#00AEEF] hover:bg-[#0096D1] shadow-lg hover:scale-110 transition-transform" onClick={handleQuickView} data-testid={`button-quickview-${id}`}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-[#00AEEF] hover:bg-[#0096D1] shadow-lg hover:scale-110 transition-transform" onClick={handleRequestQuote} data-testid={`button-quote-${id}`}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-[#00AEEF] hover:bg-[#0096D1] shadow-lg hover:scale-110 transition-transform" onClick={handleDownload} data-testid={`button-download-${id}`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile quick actions */}
        <div className="md:hidden absolute top-3 right-3 flex gap-2">
          <Button size="icon" variant="secondary" className="h-9 w-9 shadow-md" onClick={handleRequestQuote} data-testid={`button-mobile-quote-${id}`}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-9 w-9 shadow-md" onClick={handleDownload} data-testid={`button-mobile-download-${id}`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock status badge with brand colors */}
        {stockStatus !== 'in_stock' && (
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              stockStatus === 'out_of_stock' ? 'bg-[#D62828] text-white' :
              stockStatus === 'low_stock' ? 'bg-[#FF9500] text-white' :
              'bg-[#00AEEF] text-white'
            }`}>
              {stockStatus === 'out_of_stock' ? 'Out of Stock' :
               stockStatus === 'low_stock' ? 'Low Stock' : 'On Order'}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3 flex-1">
        <div className="text-xs uppercase tracking-wider text-[#002C5C] font-bold">
          {category}
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground leading-tight mb-1.5">
            <a 
              href={productLink}
              onClick={(e) => {
                if (onClick) {
                  e.preventDefault()
                  onClick()
                }
              }}
              className="hover:text-[#00AEEF] transition-colors cursor-pointer"
              data-testid={`product-card-title`}
            >
              {title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-model-${id}`}>
            <span className="font-semibold">Model:</span> <span className="font-mono">{modelNumber}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-[#00AEEF] text-[#00AEEF]' : 'fill-muted/30 text-muted'}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">({reviewCount})</span>
        </div>
        {!isCompact && (
          <div className="space-y-2 pt-2 border-t border-border">
            {specifications.workingTemp && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Working Temp:</span>
                <span className="font-mono font-semibold text-foreground">{specifications.workingTemp}</span>
              </div>
            )}
            {specifications.pressure && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pressure:</span>
                <span className="font-mono font-semibold text-foreground">{specifications.pressure}</span>
              </div>
            )}
            {specifications.voltage && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Voltage:</span>
                <span className="font-mono font-semibold text-foreground">{specifications.voltage}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <Button 
          onClick={handleRequestQuote}
          disabled={stockStatus === 'out_of_stock'}
          size={isCompact ? "sm" : "default"}
          className={`${isCompact ? "text-xs px-3" : "w-full"} font-semibold shadow-sm hover:shadow-md transition-all`}
          data-testid={`button-quote-${id}`}
        >
          <MessageSquare className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mr-2`} />
          Request Quote
        </Button>
      </CardFooter>
    </Card>
  )
}