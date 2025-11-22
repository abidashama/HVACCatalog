import { MessageSquare, Eye, Download, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useFadeIn, useHoverAnimation } from '@/hooks/useGSAPAnimations'
import { useRef } from 'react'
import { useLocation } from 'wouter'
import type { SelectProduct } from '@shared/schema'

// Helper function to convert text to proper title case
const toTitleCase = (str: string): string => {
  // Common acronyms that should stay uppercase
  const acronyms = ['lp', 'hp', 'hvac', 'ac', 'dc', 'ul', 'ce', 'nc', 'no', 'yc', 'bphe']
  
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      // Keep acronyms in uppercase
      if (acronyms.includes(word)) {
        return word.toUpperCase()
      }
      
      // Keep small words lowercase (unless they're the first word)
      const lowercase = ['for', 'and', 'or', 'the', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'by', '&']
      const isFirstWord = str.split(' ')[0].toLowerCase() === word
      
      if (lowercase.includes(word) && !isFirstWord) {
        return word
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

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
    plates?: string | number
    capacity?: string
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

  const handleAddToCompare = () => {
    // Add to comparison functionality
    const compareData = {
      id,
      title,
      modelNumber,
      image,
      price,
      category,
      specifications
    }
    
    // Store in localStorage for comparison
    const existingCompare = JSON.parse(localStorage.getItem('productCompare') || '[]')
    const isAlreadyAdded = existingCompare.some((item: any) => item.id === id)
    
    if (!isAlreadyAdded) {
      existingCompare.push(compareData)
      localStorage.setItem('productCompare', JSON.stringify(existingCompare))
      
      // Show success message (you could add a toast notification here)
      alert(`${title} added to comparison!`)
    } else {
      alert(`${title} is already in comparison!`)
    }
  }

  const handleQuickView = () => {
    // Navigate to product detail page for quick view
    setLocation(productLink)
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
      className="group relative overflow-hidden h-full flex flex-col rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2" 
      data-testid={`product-card-${id}`}
    >
      {/* Glass reflection shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div 
        className="relative aspect-square p-6 flex items-center justify-center cursor-pointer overflow-hidden bg-gradient-to-br from-white/40 to-transparent"
        onClick={handleQuickView}
      >
        {/* Product Image container - Ensure high Z-index and no blur */}
        <div className="relative w-full h-full flex items-center justify-center z-30">
          <img 
            src={image} 
            alt={title}
            className="w-[85%] h-[85%] object-contain transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-xl"
          />
        </div>
        
        {/* Hover overlay with eye icon */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-40">
          <Button 
            size="icon" 
            className="bg-white text-cyan-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 shadow-lg scale-90 hover:scale-100 transition-all duration-300 h-12 w-12 rounded-full border border-white/50" 
            onClick={(e) => {
              e.stopPropagation()
              handleQuickView()
            }} 
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>

        {/* Stock badge */}
        {stockStatus !== 'in_stock' && (
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
              stockStatus === 'out_of_stock' ? 'bg-red-500/90 text-white' :
              stockStatus === 'low_stock' ? 'bg-amber-500/90 text-white' :
              'bg-blue-500/90 text-white'
            }`}>
              {stockStatus === 'out_of_stock' ? 'Out of Stock' :
               stockStatus === 'low_stock' ? 'Low Stock' : 'On Order'}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4 flex-1 relative z-10">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 mb-1">
            {category}
          </div>
          <h3 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            <a 
              href={productLink}
              onClick={(e) => {
                if (onClick) {
                  e.preventDefault()
                  onClick()
                }
              }}
            >
              {toTitleCase(title)}
            </a>
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Model: <span className="font-mono text-slate-700">{modelNumber}</span>
          </p>
        </div>

        {!isCompact && (
          <div className="space-y-2.5 pt-4 border-t border-slate-200/50">
            {specifications.workingTemp && (
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-500 font-medium">Working Temp</span>
                <span className="px-2 py-0.5 rounded bg-slate-100/50 text-slate-700 font-mono font-semibold">{specifications.workingTemp}</span>
              </div>
            )}
            {specifications.plates && (
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-500 font-medium">Plates</span>
                <span className="px-2 py-0.5 rounded bg-slate-100/50 text-slate-700 font-mono font-semibold">{specifications.plates}</span>
              </div>
            )}
            {specifications.capacity && (
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-500 font-medium">Capacity</span>
                <span className="px-2 py-0.5 rounded bg-slate-100/50 text-slate-700 font-mono font-semibold">{specifications.capacity}</span>
              </div>
            )}
            {specifications.voltage && (
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-500 font-medium">Voltage</span>
                <span className="px-2 py-0.5 rounded bg-slate-100/50 text-slate-700 font-mono font-semibold">{specifications.voltage}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 relative z-10">
        <Button 
          onClick={handleRequestQuote}
          disabled={stockStatus === 'out_of_stock'}
          className={`w-full font-bold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 h-11 rounded-full ${
            isCompact ? "text-xs px-3" : "text-sm"
          } ${
            stockStatus === 'out_of_stock' 
              ? 'bg-slate-100 text-slate-400' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5'
          }`}
          data-testid={`button-quote-${id}`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Request Quote
        </Button>
      </CardFooter>
    </Card>
  )
}