import { Link as WouterLink, useLocation } from 'wouter'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Constant for consistent URL encoding
const PRESSURE_SWITCHES_URL = '/products?category=Pressure%20Switches'

interface BreadcrumbItemData {
  label: string
  href: string
}

interface NavigationBreadcrumbProps {
  items?: BreadcrumbItemData[]
  className?: string
}

const pathToLabel: Record<string, string> = {
  '': 'Home',
  'products': 'Products',
  'about': 'About Us',
  'contact': 'Contact',
  'category': 'Category',
  'product': 'Product',
  'pressure-switches': 'Pressure switches'
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItemData[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []

  const items: BreadcrumbItemData[] = [{ label: 'Home', href: '/' }]
  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    const label = pathToLabel[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    
    // Special handling for pressure-switches route - redirect to products page with filter
    let href = currentPath
    if (segment === 'pressure-switches' && !isLast) {
      href = PRESSURE_SWITCHES_URL
    }
    
    items.push({ label, href })
  })

  return items
}

export function NavigationBreadcrumb({ items: customItems, className }: NavigationBreadcrumbProps) {
  const [location] = useLocation()
  const items = customItems || generateBreadcrumbItems(location)

  if (items.length <= 1) return null

  return (
    <Breadcrumb className={`text-sm ${className || ''}`} data-testid="navigation-breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isHome = index === 0
          return (
            <>
              <BreadcrumbItem key={item.href}>
                {isLast ? (
                  <BreadcrumbPage className="text-muted-foreground flex items-center">
                    {isHome && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <WouterLink href={item.href} className="text-muted-foreground hover:text-foreground flex items-center">
                      {isHome && <Home className="w-4 h-4 mr-1" />}
                      {item.label}
                    </WouterLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}