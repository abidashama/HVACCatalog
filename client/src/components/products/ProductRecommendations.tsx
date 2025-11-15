import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, TrendingUp, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProductCard from './ProductCard'

// Use actual product images from public folder
const pressureSwitchImage = '/assets/images/pressure_switch/refrigeration.webp'
const heatExchangerImage = '/assets/images/heat_exchangers/heat_exchangers.webp'
const compressorImage = '/assets/images/scroll_compressors/scroll_compressor.webp'

interface Product {
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
  specifications: Record<string, string>
  tags?: string[]
}

interface ProductRecommendationsProps {
  currentProduct?: Product
  category?: string
  type?: 'related' | 'trending' | 'similar' | 'frequently_bought' | 'recommended'
  title?: string
  showHeader?: boolean
  maxItems?: number
  className?: string
}

// Mock product data - in real app this would come from API
const mockProducts: Product[] = [
  {
    id: 'lf5532-auto',
    title: 'LF5532 Automatic Reset Pressure Switch',
    modelNumber: 'LF5532-AUTO-24V',
    image: pressureSwitchImage,
    price: 89.99,
    originalPrice: 109.99,
    category: 'Pressure Switches',
    series: 'LF55 Series',
    stockStatus: 'in_stock',
    rating: 4.5,
    reviewCount: 24,
    specifications: {
      'Working Temperature': '-40°C to 120°C',
      'Pressure Range': '0.5-16 bar',
      'Voltage': '24V AC/DC',
      'Connection': '1/4" NPT'
    },
    tags: ['auto-reset', 'high-pressure', 'commercial']
  },
  {
    id: 'lf5532-manual',
    title: 'LF5532 Manual Reset Pressure Switch',
    modelNumber: 'LF5532-MAN-110V',
    image: pressureSwitchImage,
    price: 84.99,
    category: 'Pressure Switches',
    series: 'LF55 Series',
    stockStatus: 'in_stock',
    rating: 4.6,
    reviewCount: 18,
    specifications: {
      'Working Temperature': '-40°C to 120°C',
      'Pressure Range': '0.5-16 bar',
      'Voltage': '110V AC',
      'Connection': '1/4" NPT'
    },
    tags: ['manual-reset', 'safety', 'reliable']
  },
  {
    id: 'he-plate-20',
    title: 'Plate Heat Exchanger 20 Plates',
    modelNumber: 'PHE-20-STEEL',
    image: heatExchangerImage,
    price: 445.00,
    category: 'Heat Exchangers',
    series: 'PHE Series',
    stockStatus: 'in_stock',
    rating: 4.8,
    reviewCount: 12,
    specifications: {
      'Working Temperature': '-20°C to 180°C',
      'Pressure Range': '10-25 bar',
      'Connection': '1" NPT',
      'Material': 'Stainless Steel'
    },
    tags: ['high-efficiency', 'stainless-steel', 'commercial']
  },
  {
    id: 'he-plate-30',
    title: 'Plate Heat Exchanger 30 Plates',
    modelNumber: 'PHE-30-STEEL',
    image: heatExchangerImage,
    price: 615.00,
    category: 'Heat Exchangers',
    series: 'PHE Series',
    stockStatus: 'low_stock',
    rating: 4.7,
    reviewCount: 8,
    specifications: {
      'Working Temperature': '-20°C to 180°C',
      'Pressure Range': '10-25 bar',
      'Connection': '1.25" NPT',
      'Material': 'Stainless Steel'
    },
    tags: ['high-capacity', 'industrial', 'efficient']
  },
  {
    id: 'comp-scroll-3hp',
    title: 'Scroll Compressor 3HP R410A',
    modelNumber: 'SC-3HP-R410A',
    image: compressorImage,
    price: 899.99,
    originalPrice: 999.99,
    category: 'Compressors',
    series: 'Scroll Series',
    stockStatus: 'in_stock',
    rating: 4.6,
    reviewCount: 15,
    specifications: {
      'Working Temperature': '-10°C to 65°C',
      'Voltage': '220V/3Ph/50Hz',
      'Refrigerant': 'R410A',
      'Capacity': '3 HP'
    },
    tags: ['energy-efficient', 'quiet', 'refrigeration']
  },
  {
    id: 'comp-scroll-5hp',
    title: 'Scroll Compressor 5HP R410A',
    modelNumber: 'SC-5HP-R410A',
    image: compressorImage,
    price: 1299.99,
    originalPrice: 1499.99,
    category: 'Compressors',
    series: 'Scroll Series',
    stockStatus: 'on_order',
    rating: 4.7,
    reviewCount: 8,
    specifications: {
      'Working Temperature': '-10°C to 65°C',
      'Voltage': '220V/3Ph/50Hz',
      'Refrigerant': 'R410A',
      'Capacity': '5 HP'
    },
    tags: ['high-power', 'commercial', 'reliable']
  }
]

const recommendationTypes = {
  related: {
    title: 'Related Products',
    subtitle: 'Products from the same category',
    icon: TrendingUp,
    badgeColor: 'bg-blue-500'
  },
  trending: {
    title: 'Trending Products',
    subtitle: 'Popular items this month',
    icon: TrendingUp,
    badgeColor: 'bg-green-500'
  },
  similar: {
    title: 'Similar Products',
    subtitle: 'Products with similar specifications',
    icon: Zap,
    badgeColor: 'bg-purple-500'
  },
  frequently_bought: {
    title: 'Frequently Bought Together',
    subtitle: 'Customers often purchase these items together',
    icon: Users,
    badgeColor: 'bg-orange-500'
  },
  recommended: {
    title: 'Recommended for You',
    subtitle: 'Based on your browsing history',
    icon: Heart,
    badgeColor: 'bg-pink-500'
  }
}

export default function ProductRecommendations({
  currentProduct,
  category,
  type = 'related',
  title,
  showHeader = true,
  maxItems = 6,
  className
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get recommendations
    const getRecommendations = () => {
      setLoading(true)
      
      setTimeout(() => {
        let filtered = mockProducts.filter(product => 
          !currentProduct || product.id !== currentProduct.id
        )

        switch (type) {
          case 'related':
            if (category) {
              filtered = filtered.filter(product => product.category === category)
            } else if (currentProduct) {
              filtered = filtered.filter(product => product.category === currentProduct.category)
            }
            break
            
          case 'similar':
            if (currentProduct) {
              // Find products with similar tags or specifications
              filtered = filtered.filter(product => {
                const commonTags = product.tags?.filter(tag => 
                  currentProduct.tags?.includes(tag)
                ).length || 0
                return commonTags > 0 || product.series === currentProduct.series
              })
            }
            break
            
          case 'trending':
            // Sort by rating and review count
            filtered = filtered.sort((a, b) => 
              (b.rating * b.reviewCount) - (a.rating * a.reviewCount)
            )
            break
            
          case 'frequently_bought':
            if (currentProduct) {
              // Simulate frequently bought together logic
              filtered = filtered.filter(product => 
                product.category !== currentProduct.category
              ).slice(0, 3)
            }
            break
            
          case 'recommended':
            // Mix of high-rated and popular products
            filtered = filtered.sort((a, b) => {
              const scoreA = a.rating + (a.reviewCount * 0.1)
              const scoreB = b.rating + (b.reviewCount * 0.1)
              return scoreB - scoreA
            })
            break
        }

        setRecommendations(filtered.slice(0, maxItems))
        setLoading(false)
      }, 500)
    }

    getRecommendations()
  }, [currentProduct, category, type, maxItems])

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {showHeader && (
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  const typeConfig = recommendationTypes[type]
  const IconComponent = typeConfig.icon

  return (
    <div className={`space-y-6 ${className}`} data-testid={`recommendations-${type}`}>
      {showHeader && (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 ${typeConfig.badgeColor} text-white rounded-lg flex items-center justify-center`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {title || typeConfig.title}
            </h2>
            <p className="text-muted-foreground">
              {typeConfig.subtitle}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            modelNumber={product.modelNumber}
            image={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            category={product.category}
            series={product.series}
            stockStatus={product.stockStatus}
            rating={product.rating}
            reviewCount={product.reviewCount}
            specifications={product.specifications}
          />
        ))}
      </div>

      {recommendations.length >= maxItems && (
        <div className="text-center">
          <Button variant="outline" data-testid={`view-more-${type}`}>
            View More {typeConfig.title}
          </Button>
        </div>
      )}
    </div>
  )
}