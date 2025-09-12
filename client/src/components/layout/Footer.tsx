import { Link } from 'wouter'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press Releases', href: '/press' }
  ],
  products: [
    { name: 'All Products', href: '/products' },
    { name: 'Pressure Switches', href: '/category/pressure-switches' },
    { name: 'Heat Exchangers', href: '/category/heat-exchangers' },
    { name: 'Refrigeration Components', href: '/category/refrigeration' }
  ],
  support: [
    { name: 'Services', href: '/services' },
    { name: 'Resources', href: '/resources' },
    { name: 'Technical Support', href: '/contact' },
    { name: 'Documentation', href: '/resources' }
  ],
  quickLinks: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Resources', href: '/resources' }
  ]
}

// Ensure all footer link arrays are properly initialized
const safeFooterLinks = {
  company: footerLinks?.company || [],
  products: footerLinks?.products || [],
  support: footerLinks?.support || [],
  quickLinks: footerLinks?.quickLinks || []
}

export default function Footer() {
  // todo: remove mock functionality - integrate with real newsletter signup
  const handleNewsletterSignup = (email: string) => {
    console.log('Newsletter signup:', email)
  }

  const handleLinkClick = (href: string, name: string) => {
    console.log('Navigate to:', href, name)
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground text-primary rounded-md flex items-center justify-center font-bold text-lg">
                IH
              </div>
              <div>
                <h3 className="text-xl font-bold">Industrial HVAC</h3>
                <p className="text-sm text-primary-foreground/80">Professional Equipment</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 leading-relaxed">
              Your trusted partner for premium HVAC and refrigeration equipment. 
              Serving professionals with quality Axeon & Lefoo products since 1998.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">1-800-HVAC-PRO (1-800-482-2776)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">sales@industrialhvac.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <div>Industrial HVAC Solutions</div>
                  <div>1234 Equipment Drive</div>
                  <div>Industrial City, IC 12345</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 pt-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary hover:bg-primary-foreground">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary hover:bg-primary-foreground">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary hover:bg-primary-foreground">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary hover:bg-primary-foreground">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {safeFooterLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2">
              {safeFooterLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    data-testid={`footer-product-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              {safeFooterLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    data-testid={`footer-support-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Newsletter */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                {safeFooterLinks.quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                      data-testid={`footer-quick-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Newsletter</h3>
              <p className="text-sm text-primary-foreground/80">
                Get the latest product updates and industry insights.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email"
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNewsletterSignup((e.target as HTMLInputElement).value)
                    }
                  }}
                  data-testid="input-newsletter-email"
                />
                <Button 
                  variant="secondary"
                  onClick={() => {
                    const input = document.querySelector('[data-testid="input-newsletter-email"]') as HTMLInputElement
                    if (input?.value) {
                      handleNewsletterSignup(input.value)
                    }
                  }}
                  data-testid="button-newsletter-signup"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-primary-foreground/20" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-primary-foreground/80">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span>&copy; 2024 Industrial HVAC Solutions. All rights reserved.</span>
            <div className="flex gap-4">
              <Link 
                href="/privacy"
                className="hover:text-primary-foreground transition-colors"
                data-testid="footer-privacy-link"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms"
                className="hover:text-primary-foreground transition-colors"
                data-testid="footer-terms-link"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies"
                className="hover:text-primary-foreground transition-colors"
                data-testid="footer-cookies-link"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>Authorized dealer:</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-xs font-medium">AXEON</span>
              <span className="px-2 py-1 bg-primary-foreground/10 rounded text-xs font-medium">LEFOO</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}