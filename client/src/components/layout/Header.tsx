import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { Search, Menu, User, Phone, Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import InquiryModal from '@/components/modals/InquiryModal'
import { PRODUCT_CATEGORIES } from '@shared/schema'

const mainNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' }
]

// Use canonical categories from shared schema
const categories = PRODUCT_CATEGORIES.map((category, index) => ({
  id: index + 1,
  name: category.name,
  href: `/products?category=${encodeURIComponent(category.id)}`,
  description: category.description
}))

export default function Header() {
  const [location] = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    const category = PRODUCT_CATEGORIES.find(cat => cat.name === categoryName)
    if (category) {
      window.location.href = `/products?category=${encodeURIComponent(category.id)}`
    }
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
            <InquiryModal 
              trigger={
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-primary-foreground" data-testid="button-header-request-quote">
                  Request Quote
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md p-2" data-testid="link-home-logo">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold text-lg">
              IH
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Industrial HVAC</h1>
              <p className="text-xs text-muted-foreground">Professional Equipment</p>
            </div>
          </Link>

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
                data-testid="button-header-search"
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
            <div className="flex items-center space-x-6">
              {/* Main Navigation Links */}
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-foreground hover:text-primary font-medium transition-colors px-2 py-1 rounded-md ${
                    location === item.href ? 'text-primary font-semibold' : ''
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Divider */}
              <div className="w-px h-6 bg-border"></div>
              
              {/* Product Categories - Direct links to avoid layout shifts */}
              {categories.map((category) => (
                <button 
                  key={category.id}
                  className="text-foreground hover:text-primary font-medium transition-colors px-2 py-1 rounded-md"
                  onClick={() => handleCategoryClick(category.name)}
                  data-testid={`nav-category-${category.id}`}
                >
                  {category.name}
                </button>
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
            
            {/* Main Navigation */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground px-2 uppercase tracking-wide">Navigation</h3>
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full text-left py-3 px-2 text-foreground hover:text-primary hover:bg-muted rounded-md font-medium transition-colors active-elevate-2 ${
                    location === item.href ? 'text-primary bg-muted' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Product Categories */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h3 className="text-sm font-semibold text-muted-foreground px-2 uppercase tracking-wide">Product Categories</h3>
              {categories.map((category) => (
                <button 
                  key={category.id}
                  className="block w-full text-left py-3 px-2 text-foreground hover:text-primary hover:bg-muted rounded-md font-medium transition-colors active-elevate-2"
                  onClick={() => {
                    handleCategoryClick(category.name)
                    setMobileMenuOpen(false)
                  }}
                  data-testid={`button-mobile-category-${category.id}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Mobile-specific actions */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="w-full" data-testid="mobile-account-button">
                  Account
                </Button>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full" data-testid="mobile-support-button">
                    Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}