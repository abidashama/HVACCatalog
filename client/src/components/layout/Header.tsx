import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { Menu, User, Phone, Mail, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import InquiryModal from '@/components/modals/InquiryModal'
import { PRODUCT_CATEGORIES } from '@shared/schema'
import axeonLogo from '@/assets/images/axeon-logo.svg'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mainNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]

const categories = PRODUCT_CATEGORIES.map((category, index) => ({
  id: index + 1,
  name: category.name,
  href: `/products?category=${encodeURIComponent(category.id)}`,
  description: category.description
}))

export default function Header() {
  const [location] = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [mobileMenuOpen])

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

  const handleCategoryClick = (categoryName: string) => {
    const category = PRODUCT_CATEGORIES.find(cat => cat.name === categoryName)
    if (category) {
      window.location.href = `/products?category=${encodeURIComponent(category.id)}`
    }
  }

  return (
    <header className={`sticky top-0 z-50 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/75 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+91 9096354646</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>axeoncorporation@gmail.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
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

      <div className="px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md p-2" data-testid="link-home-logo">
            <img 
              src={axeonLogo} 
              alt="Axeon Corporation Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Axeon Corporation</h1>
              <p className="text-xs text-muted-foreground">HVAC & Refrigeration Solutions</p>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center space-x-2">
              {mainNavigation.map((item) => {
                const active = location === item.href
                if (item.name === 'Products') {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`relative inline-flex items-center gap-1 text-foreground hover:text-primary font-medium transition-colors px-3 py-1.5 rounded-md ${active ? 'text-primary' : ''}`}
                          data-testid={`nav-link-${item.name.toLowerCase()}`}
                        >
                          {item.name}
                          <ChevronDown className="w-4 h-4" />
                          <span className={`pointer-events-none absolute left-3 right-3 -bottom-1 h-0.5 rounded bg-accent transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-56">
                        {categories.map((category) => (
                          <DropdownMenuItem key={category.id} asChild>
                            <a
                              href={`/products?category=${encodeURIComponent(category.name)}`}
                              data-testid={`nav-subcategory-${category.id}`}
                            >
                              {category.name}
                            </a>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem asChild>
                          <a href="/products">All Products</a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-foreground hover:text-primary font-medium transition-colors px-3 py-1.5 rounded-md ${active ? 'text-primary' : ''}`}
                    data-testid={`nav-link-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                    <span className={`pointer-events-none absolute left-3 right-3 -bottom-1 h-0.5 rounded bg-accent transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative active-elevate-2 h-11 w-11 md:h-9 md:w-9" data-testid="button-user-menu" aria-label="User menu">
                <User className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden active-elevate-2 h-11 w-11"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border animate-slide-in">
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground px-2 uppercase tracking-wide">Navigation</h3>
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full text-left py-3 px-2 text-foreground hover:text-primary hover:bg-muted rounded-md font-medium transition-colors active-elevate-2 ${location === item.href ? 'text-primary bg-muted' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
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