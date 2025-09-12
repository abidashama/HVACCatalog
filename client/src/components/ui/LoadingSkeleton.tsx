import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface LoadingSkeletonProps {
  variant?: 'product' | 'list' | 'detail' | 'grid'
  count?: number
  className?: string
}

export function ProductCardSkeleton() {
  return (
    <Card className="hover-elevate animate-pulse">
      <CardHeader className="space-y-4">
        <div className="w-full h-48 bg-muted rounded-md"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded flex-1"></div>
          <div className="h-8 bg-muted rounded flex-1"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b animate-pulse">
      <div className="w-16 h-16 bg-muted rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-3 bg-muted rounded w-16"></div>
          <div className="h-3 bg-muted rounded w-20"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded w-16"></div>
        <div className="h-4 bg-muted rounded w-12"></div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Breadcrumb */}
      <div className="flex space-x-2">
        <div className="h-4 bg-muted rounded w-12"></div>
        <div className="h-4 bg-muted rounded w-1"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
        <div className="h-4 bg-muted rounded w-1"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg"></div>
          <div className="flex space-x-2">
            <div className="w-16 h-16 bg-muted rounded"></div>
            <div className="w-16 h-16 bg-muted rounded"></div>
            <div className="w-16 h-16 bg-muted rounded"></div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
          
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
          
          <div className="flex space-x-4">
            <div className="h-10 bg-muted rounded flex-1"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
      
      {/* Specifications Table */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function LoadingSkeleton({ variant = 'product', count = 1, className }: LoadingSkeletonProps) {
  const skeletonComponents = {
    product: () => <ProductCardSkeleton />,
    list: () => <ListItemSkeleton />,
    detail: () => <ProductDetailSkeleton />,
    grid: () => <GridSkeleton count={count} />
  }

  const SkeletonComponent = skeletonComponents[variant]

  return (
    <div className={className} data-testid={`loading-skeleton-${variant}`}>
      {variant === 'grid' ? (
        <SkeletonComponent />
      ) : (
        [...Array(count)].map((_, i) => (
          <div key={i}>
            <SkeletonComponent />
          </div>
        ))
      )}
    </div>
  )
}