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
    <footer className="bg-slate-900 text-slate-200 relative overflow-hidden">
      {/* Decorative top border/gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-80" />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/images/axeon-logo.svg" 
                alt="Axeon Corporation Logo" 
                className="h-10 brightness-0 invert opacity-90"
              />
            </div>
            
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              Your trusted partner for premium HVAC and refrigeration equipment. 
              Serving professionals with quality Axeon & Lefoo products since 1998.
            </p>

            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <Button 
                  key={i}
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:scale-110 transition-all duration-300 border border-slate-700/50 hover:border-transparent shadow-sm hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-500 after:rounded-full">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 mt-1">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Call Us</div>
                  <a href="tel:+919096354646" className="text-slate-300 hover:text-blue-400 transition-colors font-medium block">
                    +91 9096354646
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 mt-1">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Email Us</div>
                  <a href="mailto:axeoncorporation@gmail.com" className="text-slate-300 hover:text-blue-400 transition-colors font-medium block break-all">
                    axeoncorporation@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Visit Us</div>
                  <div className="text-slate-300 text-sm leading-relaxed">
                    Gajanan Colony, Cs. no. 6629,<br/>
                    Old Kupwad Road, Sangli - 416416
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-500 after:rounded-full">
              Products
            </h3>
            <ul className="space-y-3">
              {safeFooterLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-500 after:rounded-full">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {safeFooterLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-all duration-200 flex items-center gap-2 group"
                    data-testid={`footer-quick-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-slate-500">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <span>&copy; 2025 Axeon Corporation. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Authorized Dealer:</span>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold text-slate-300 tracking-widest">AXEON</span>
              <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold text-slate-300 tracking-widest">LEFOO</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}