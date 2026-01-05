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

// Constants for consistent URL encoding
const PRESSURE_SWITCHES_URL = '/products?category=Pressure%20Switches'
const VALVES_URL = '/products?category=Valves'
const PRESSURE_TRANSMITTERS_URL = '/products?category=Pressure%20Transmitters'
const HEAT_EXCHANGERS_URL = '/products?category=Heat%20Exchangers'
const AXEON_VALVES_URL = '/products?category=Axeon%20Valves'
const FILTER_DRIERS_URL = '/products?category=Filter%20Driers%2FFilter%20Drier%20Shell'
const PRESSURE_GAUGE_URL = '/products?category=Pressure%20Gauge%2FManifold%20Gauge'
const TEFLON_TAPE_URL = '/products?category=Teflon%20Tape'
const AXEON_PUMPS_URL = '/products?category=Axeon%20Pumps'
const VIBRATION_ELIMINATORS_URL = '/products?category=Vibration%20Eliminators'
const BRAZING_ROD_URL = '/products?category=Brazing%20Rod'
const RELAY_URL = '/products?category=Relay'
const SCROLL_COMPRESSORS_URL = '/products?category=Scroll%20Compressors'
const FLOW_SWITCHES_URL = '/products?category=Flow%20Switches'

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
  'pressure-switches': 'Pressure Switches',
  'valves': 'Valves',
  'flow-switches': 'Flow Switches',
  'pressure-transmitters': 'Pressure Transmitters',
  'heat-exchangers': 'Heat Exchangers',
  'bphe': 'BPHE Series',
  'axeon-valves': 'Axeon Valves',
  'axeon-series': 'Axeon Series',
  'filter-driers': 'Filter Driers',
  'pressure-gauge': 'Pressure Gauge',
  'teflon-tape': 'Teflon Tape',
  'axeon-pumps': 'Axeon Pumps',
  'vibration-eliminators': 'Vibration Eliminators',
  'brazing-rod': 'Brazing Rod',
  'relay': 'Relay',
  'scroll-compressors': 'Scroll Compressors',
  'chiller': 'Chiller',
  'heat-pump': 'Heat Pump'
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
    
    // Special handling for category routes - redirect to products page with filter
    let href = currentPath
    if (segment === 'pressure-switches' && !isLast) {
      href = PRESSURE_SWITCHES_URL
    } else if (segment === 'valves' && !isLast) {
      href = VALVES_URL
    } else if (segment === 'flow-switches' && !isLast) {
      href = FLOW_SWITCHES_URL
    } else if (segment === 'pressure-transmitters' && !isLast) {
      href = PRESSURE_TRANSMITTERS_URL
    } else if (segment === 'heat-exchangers' && !isLast) {
      href = HEAT_EXCHANGERS_URL
    } else if (segment === 'axeon-valves' && !isLast) {
      href = AXEON_VALVES_URL
    } else if (segment === 'filter-driers' && !isLast) {
      href = FILTER_DRIERS_URL
    } else if (segment === 'pressure-gauge' && !isLast) {
      href = PRESSURE_GAUGE_URL
    } else if (segment === 'teflon-tape' && !isLast) {
      href = TEFLON_TAPE_URL
    } else if (segment === 'axeon-pumps' && !isLast) {
      href = AXEON_PUMPS_URL
    } else if (segment === 'vibration-eliminators' && !isLast) {
      href = VIBRATION_ELIMINATORS_URL
    } else if (segment === 'brazing-rod' && !isLast) {
      href = BRAZING_ROD_URL
    } else if (segment === 'relay' && !isLast) {
      href = RELAY_URL
    } else if (segment === 'scroll-compressors' && !isLast) {
      href = SCROLL_COMPRESSORS_URL
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