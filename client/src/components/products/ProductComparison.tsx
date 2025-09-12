import { useState } from 'react'
import { X, Star, Download, ShoppingCart, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  features?: string[]
  applications?: string[]
  downloads?: Array<{ name: string; type: string; size: string }>
}

interface ProductComparisonProps {
  products: Product[]
  onRemoveProduct: (productId: string) => void
  onClearAll: () => void
}

const specificationCategories = {
  'Physical': ['Dimensions', 'Weight', 'Housing Material', 'Connection Type'],
  'Performance': ['Working Temperature', 'Pressure Range', 'Electrical Rating', 'Switching Differential'],
  'Certifications': ['Approvals', 'Sealing', 'Reset Type'],
  'General': ['Voltage', 'Current Rating', 'Frequency']
}

const stockStatusConfig = {
  in_stock: { label: 'In Stock', color: 'bg-green-500', textColor: 'text-green-700' },
  low_stock: { label: 'Low Stock', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-700' },
  on_order: { label: 'On Order', color: 'bg-blue-500', textColor: 'text-blue-700' }
}

export default function ProductComparison({ products, onRemoveProduct, onClearAll }: ProductComparisonProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Products to Compare</h3>
          <p className="text-muted-foreground">Add products to your comparison list to see detailed side-by-side specifications.</p>
        </CardContent>
      </Card>
    )
  }

  const getAllSpecKeys = () => {
    const keys = new Set<string>()
    products.forEach(product => {
      Object.keys(product.specifications).forEach(key => keys.add(key))
    })
    return Array.from(keys).sort()
  }

  const categorizeSpecs = (specKeys: string[]) => {
    const categorized: Record<string, string[]> = {}
    
    Object.entries(specificationCategories).forEach(([category, categoryKeys]) => {
      const matchedKeys = specKeys.filter(key => 
        categoryKeys.some(catKey => key.includes(catKey) || catKey.includes(key))
      )
      if (matchedKeys.length > 0) {
        categorized[category] = matchedKeys
      }
    })
    
    // Add any remaining specs to 'Other' category
    const usedKeys = Object.values(categorized).flat()
    const remainingKeys = specKeys.filter(key => !usedKeys.includes(key))
    if (remainingKeys.length > 0) {
      categorized['Other'] = remainingKeys
    }
    
    return categorized
  }

  const specKeys = getAllSpecKeys()
  const categorizedSpecs = categorizeSpecs(specKeys)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Product Comparison</h2>
          <p className="text-muted-foreground">Compare up to {products.length} products side by side</p>
        </div>
        <Button 
          variant="outline" 
          onClick={onClearAll}
          data-testid="button-clear-comparison"
        >
          Clear All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" data-testid="tab-comparison-overview">Overview</TabsTrigger>
          <TabsTrigger value="specifications" data-testid="tab-comparison-specs">Specifications</TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-comparison-features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const stockConfig = stockStatusConfig[product.stockStatus]
              return (
                <Card key={product.id} className="relative hover-elevate">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => onRemoveProduct(product.id)}
                    data-testid={`button-remove-${product.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <CardHeader className="text-center pb-4">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-32 h-32 object-contain mx-auto mb-4"
                    />
                    <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.modelNumber}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stock Status */}
                    <div className="flex justify-center">
                      <Badge 
                        className={`${stockConfig.color} text-white`}
                        data-testid={`stock-status-${product.id}`}
                      >
                        {stockConfig.label}
                      </Badge>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    {/* Series */}
                    <div className="text-center">
                      <Badge variant="secondary">{product.series}</Badge>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" data-testid={`button-add-cart-${product.id}`}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" className="w-full" data-testid={`button-view-details-${product.id}`}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-8">
            {Object.entries(categorizedSpecs).map(([category, specs]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium text-muted-foreground min-w-48">
                              Specification
                            </th>
                            {products.map((product) => (
                              <th key={product.id} className="text-center p-4 font-medium text-muted-foreground min-w-48">
                                {product.modelNumber}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {specs.map((spec) => (
                            <tr key={spec} className="border-b">
                              <td className="p-4 font-medium">{spec}</td>
                              {products.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                  {product.specifications[spec] || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover-elevate">
                <CardHeader>
                  <CardTitle className="text-lg">{product.modelNumber}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.features && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Features</h4>
                      <ul className="space-y-1 text-sm">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-muted-foreground">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.applications && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Applications</h4>
                      <ul className="space-y-1 text-sm">
                        {product.applications.map((app, index) => (
                          <li key={index} className="text-muted-foreground">• {app}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.downloads && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Downloads</h4>
                      <div className="space-y-2">
                        {product.downloads.map((download, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start"
                            data-testid={`download-${product.id}-${index}`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            <div className="text-left">
                              <div className="text-xs">{download.name}</div>
                              <div className="text-xs text-muted-foreground">{download.size}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}