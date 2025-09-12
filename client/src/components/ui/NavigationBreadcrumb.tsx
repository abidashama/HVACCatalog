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
  'services': 'Services',
  'resources': 'Resources',
  'category': 'Category',
  'product': 'Product'
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItemData[] {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) {
    return []
  }

  const items: BreadcrumbItemData[] = [
    { label: 'Home', href: '/' }
  ]

  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // For dynamic routes like /product/slug or /category/slug
    if (index === segments.length - 1 && (segments[0] === 'product' || segments[0] === 'category')) {
      // For product details, show a formatted name
      if (segments[0] === 'product') {
        items.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentPath
        })
      } else {
        items.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentPath
        })
      }
    } else {
      const label = pathToLabel[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      items.push({
        label,
        href: currentPath
      })
    }
  })

  return items
}

export function NavigationBreadcrumb({ items: customItems, className }: NavigationBreadcrumbProps) {
  const [location] = useLocation()
  
  const items = customItems || generateBreadcrumbItems(location)
  
  // Don't show breadcrumbs on home page or if there's only home
  if (items.length <= 1) {
    return null
  }

  return (
    <Breadcrumb className={className} data-testid="navigation-breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isHome = index === 0
          
          return (
            <div key={item.href} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage 
                    data-testid={`breadcrumb-current-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {isHome && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <WouterLink
                      href={item.href}
                      data-testid={`breadcrumb-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {isHome && <Home className="w-4 h-4 mr-1" />}
                      {item.label}
                    </WouterLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}