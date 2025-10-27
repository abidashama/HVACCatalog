import { Link } from 'wouter'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// Logo removed - using static path

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
    { name: 'Technical Support', href: '/contact' },
    { name: 'Documentation', href: '/products' }
  ],
  quickLinks: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]
}

const safeFooterLinks = {
  company: footerLinks?.company || [],
  products: footerLinks?.products || [],
  support: footerLinks?.support || [],
  quickLinks: footerLinks?.quickLinks || []
}

export default function Footer() {
  const handleLinkClick = (href: string, name: string) => {
    console.log('Navigate to:', href, name)
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/images/axeon-logo.svg" 
                alt="Axeon Corporation Logo" 
                className="h-10"
              />
            </div>
            
            <p className="text-primary-foreground/90 leading-relaxed">
              Your trusted partner for premium HVAC and refrigeration equipment. 
              Serving professionals with quality Axeon & Lefoo products since 1998.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 9096354646</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">axeoncorporation@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <div>Axeon Corporation</div>
                  <div>Gajanan Colony, Cs. no. 6629, Old Kupwad Road</div>
                  <div>Sangli - 416416</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
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
        </div>
      </div>

      <Separator className="bg-primary-foreground/20" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-primary-foreground/80">
          <div className="flex justify-center md:justify-start">
            <span>&copy; 2025 Axeon Corporation. All rights reserved.</span>
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