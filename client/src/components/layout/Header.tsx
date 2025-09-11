import { useState, useEffect } from 'react'
import { Search, Menu, ShoppingCart, User, Phone, Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const categories = [
  { id: 1, name: 'Pressure Switches', href: '/category/pressure-switches', subcategories: ['LF55 Series', 'LF32 Series', 'LFSV-D Series'] },
  { id: 2, name: 'Heat Exchangers', href: '/category/heat-exchangers', subcategories: ['Plate Heat Exchangers', 'Coaxial Exchangers', 'Shell & Tube'] },
  { id: 3, name: 'Refrigeration Components', href: '/category/refrigeration', subcategories: ['Compressors', 'Condensers', 'Evaporators'] },
  { id: 4, name: 'HVAC Controls', href: '/category/hvac-controls', subcategories: ['Thermostats', 'Sensors', 'Actuators'] },
  { id: 5, name: 'Valves & Fittings', href: '/category/valves', subcategories: ['Ball Valves', 'Check Valves', 'Fittings'] },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [megaMenuOpen, setMegaMenuOpen] = useState<number | null>(null)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [mobileMenuOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen])

  // todo: remove mock functionality - integrate with real search
  const handleSearch = () => {
    console.log('Search triggered:', searchQuery)
  }

  const handleCategoryClick = (category: string) => {
    console.log('Navigate to category:', category)
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>1-800-HVAC-PRO</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>sales@industrialhvac.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Free shipping on orders over $500</span>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-primary-foreground">
              Request Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold text-lg">
              IH
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Industrial HVAC</h1>
              <p className="text-xs text-muted-foreground">Professional Equipment</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products, model numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions - Larger mobile touch targets */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden active-elevate-2 h-11 w-11 md:h-9 md:w-9" data-testid="button-mobile-search">
              <Search className="w-5 h-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative active-elevate-2 h-11 w-11 md:h-9 md:w-9" data-testid="button-user-menu">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative active-elevate-2 h-11 w-11 md:h-9 md:w-9" data-testid="button-cart">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center" data-testid="badge-cart-count">3</Badge>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden active-elevate-2 h-11 w-11"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden md:flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setMegaMenuOpen(category.id)}
                  onMouseLeave={() => setMegaMenuOpen(null)}
                >
                  <button 
                    className="text-foreground hover:text-primary font-medium transition-colors"
                    onClick={() => handleCategoryClick(category.href)}
                  >
                    {category.name}
                  </button>
                  
                  {/* Mega Menu */}
                  {megaMenuOpen === category.id && (
                    <div className="absolute top-full left-0 w-64 bg-popover border border-popover-border rounded-md shadow-lg p-4 mt-1">
                      <div className="space-y-2">
                        {category.subcategories.map((sub) => (
                          <button 
                            key={sub}
                            className="block w-full text-left px-2 py-1 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-sm"
                            onClick={() => handleCategoryClick(`${category.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`)}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Need help? Call 1-800-HVAC-PRO</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border animate-slide-in">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 h-12 text-base"
                data-testid="input-mobile-search"
              />
              <Button size="icon" className="absolute right-1 top-1 h-10" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <button 
                  key={category.id}
                  className="block w-full text-left py-3 px-2 text-foreground hover:text-primary hover:bg-muted rounded-md font-medium transition-colors active-elevate-2"
                  onClick={() => handleCategoryClick(category.href)}
                  data-testid={`button-mobile-category-${category.id}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {/* Mobile-specific actions */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="w-full">
                  Account
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}