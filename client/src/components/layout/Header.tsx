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
  const [location, setLocation] = useLocation()
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
      setLocation(`/products?category=${encodeURIComponent(category.id)}`)
    }
  }

  return (
    <header className={`sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="bg-gradient-to-r from-[#002C5C] via-[#003870] to-[#002C5C] text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-[#00AEEF] transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-medium">+91 9096354646</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#00AEEF] transition-colors">
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

      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform rounded-md p-2" data-testid="link-home-logo">
            <img 
              src={axeonLogo} 
              alt="Axeon Corporation Logo" 
              className="h-12"
            />
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center space-x-1">
              {mainNavigation.map((item) => {
                const active = location === item.href
                if (item.name === 'Products') {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`relative inline-flex items-center gap-1 hover:bg-primary/10 font-semibold transition-all px-4 py-2 rounded-lg ${active ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                          data-testid={`nav-link-${item.name.toLowerCase()}`}
                        >
                          {item.name}
                          <ChevronDown className="w-4 h-4" />
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
                    className={`relative hover:bg-primary/10 font-semibold transition-all px-4 py-2 rounded-lg ${active ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                    data-testid={`nav-link-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="default" size="icon" className="shadow-sm hover:shadow-md h-10 w-10" data-testid="button-user-menu" aria-label="User menu">
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