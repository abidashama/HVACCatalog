import { Heart, ShoppingCart, Eye, Star, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useFadeIn, useHoverAnimation } from '@/hooks/useGSAPAnimations'
import { useRef } from 'react'

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
  
  // Animation hooks
  const cardRef = useRef<HTMLDivElement>(null)
  const fadeRef = useFadeIn(0.5)
  useHoverAnimation(cardRef)
  
  // todo: remove mock functionality - integrate with real product actions
  const handleAddToCart = () => {
    console.log('Add to cart:', id, title)
  }

  const handleWishlist = () => {
    console.log('Add to wishlist:', id, title)
  }

  const handleQuickView = () => {
    console.log('Quick view:', id, title)
  }

  const handleDownload = () => {
    console.log('Download spec sheet:', id, title)
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
    <Card ref={cardRef} className="group hover-elevate transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative overflow-hidden bg-card">
        <div className="aspect-square p-6 flex items-center justify-center bg-gradient-to-br from-card to-muted">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Overlay Actions - Hidden on Mobile for Touch Interaction */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 hidden md:flex">
          <Button size="icon" variant="secondary" onClick={handleQuickView} data-testid={`button-quickview-${id}`}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleWishlist} data-testid={`button-wishlist-${id}`}>
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleDownload} data-testid={`button-download-${id}`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Action Bar - Larger touch targets for field use */}
        <div className="md:hidden absolute top-2 right-2 flex gap-1">
          <Button size="icon" variant="secondary" className="h-11 w-11" onClick={handleWishlist} data-testid={`button-mobile-wishlist-${id}`}>
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-11 w-11" onClick={handleDownload} data-testid={`button-mobile-download-${id}`}>
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {savings && (
            <Badge className="bg-destructive text-destructive-foreground">
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

      <CardContent className="p-4 space-y-3">
        {/* Category */}
        <div className="text-sm text-muted-foreground font-medium">
          {category}
        </div>

        {/* Title & Model */}
        <div>
          <h3 className="font-semibold text-foreground leading-tight mb-1" data-testid={`text-title-${id}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-mono" data-testid={`text-model-${id}`}>
            Model: {modelNumber}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-chart-3 text-chart-3' : 'text-muted'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Key Specifications */}
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
        {/* Price */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary" data-testid={`text-price-${id}`}>
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

        {/* Add to Cart - Responsive sizing with larger mobile touch targets */}
        <Button 
          onClick={handleAddToCart}
          disabled={stockStatus === 'out_of_stock'}
          size={isCompact ? "sm" : "default"}
          className={`${isCompact ? "text-xs px-3" : ""} h-11 md:h-9`}
          data-testid={`button-addcart-${id}`}
        >
          <ShoppingCart className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mr-1 md:mr-2`} />
          <span className="hidden sm:inline">Add to </span>Cart
        </Button>
      </CardFooter>
    </Card>
  )
}