import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  structuredData?: object
  noIndex?: boolean
}

const defaultSEO = {
  title: 'Industrial HVAC Solutions - Professional HVAC & Refrigeration Equipment',
  description: 'Leading supplier of professional HVAC and refrigeration equipment. Pressure switches, heat exchangers, compressors, and technical support for contractors and engineers.',
  keywords: 'HVAC equipment, refrigeration, pressure switches, heat exchangers, compressors, Lefoo, Axeon, commercial HVAC, industrial cooling',
  ogImage: '/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false
}: SEOHeadProps) {
  
  const finalTitle = title ? `${title} | Industrial HVAC Solutions` : defaultSEO.title
  const finalDescription = description || defaultSEO.description
  const finalKeywords = keywords || defaultSEO.keywords
  const finalOgTitle = ogTitle || title || defaultSEO.title
  const finalOgDescription = ogDescription || description || defaultSEO.description
  const finalOgImage = ogImage || defaultSEO.ogImage

  useEffect(() => {
    // Set title
    document.title = finalTitle

    // Set meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      meta.content = content
    }

    // Basic meta tags
    setMetaTag('description', finalDescription)
    setMetaTag('keywords', finalKeywords)
    
    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow')
    } else {
      setMetaTag('robots', 'index, follow')
    }

    // Open Graph tags
    setMetaTag('og:title', finalOgTitle, true)
    setMetaTag('og:description', finalOgDescription, true)
    setMetaTag('og:image', finalOgImage, true)
    setMetaTag('og:type', ogType, true)
    setMetaTag('og:site_name', 'Industrial HVAC Solutions', true)
    
    if (canonical) {
      setMetaTag('og:url', canonical, true)
    }

    // Twitter Card tags
    setMetaTag('twitter:card', twitterCard)
    setMetaTag('twitter:title', finalOgTitle)
    setMetaTag('twitter:description', finalOgDescription)
    setMetaTag('twitter:image', finalOgImage)
    setMetaTag('twitter:site', '@IndustrialHVAC')

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(structuredData)
    }

    // Industry-specific meta tags
    setMetaTag('industry', 'HVAC, Refrigeration, Industrial Equipment')
    setMetaTag('geo.region', 'US')
    setMetaTag('geo.country', 'United States')
    setMetaTag('target-audience', 'HVAC Contractors, Technicians, Engineers')
    
  }, [finalTitle, finalDescription, finalKeywords, canonical, finalOgTitle, finalOgDescription, finalOgImage, ogType, twitterCard, structuredData, noIndex])

  return null
}

// Predefined SEO configurations for different page types
export const seoConfigs = {
  home: {
    title: 'Professional HVAC & Refrigeration Equipment',
    description: 'Leading supplier of professional HVAC and refrigeration equipment. Pressure switches, heat exchangers, compressors, and expert technical support for contractors and engineers.',
    keywords: 'HVAC equipment, refrigeration equipment, pressure switches, heat exchangers, compressors, professional HVAC, commercial refrigeration',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Industrial HVAC Solutions",
      "url": "https://industrialhvac.com",
      "logo": "https://industrialhvac.com/logo.png",
      "description": "Professional HVAC and refrigeration equipment supplier",
      "sameAs": [
        "https://linkedin.com/company/industrial-hvac-solutions",
        "https://twitter.com/IndustrialHVAC"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-482-2776",
        "contactType": "customer service",
        "availableLanguage": "English"
      }
    }
  },
  
  products: {
    title: 'HVAC & Refrigeration Products',
    description: 'Browse our complete catalog of professional HVAC and refrigeration products. Pressure switches, heat exchangers, compressors, and controls from trusted brands.',
    keywords: 'HVAC products, refrigeration components, pressure switches, heat exchangers, compressors, HVAC controls, Lefoo, Axeon'
  },
  
  productDetail: (productTitle: string, productDescription: string, productPrice: number) => ({
    title: productTitle,
    description: productDescription,
    ogType: 'product',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productTitle,
      "description": productDescription,
      "offers": {
        "@type": "Offer",
        "price": productPrice,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  }),
  
  category: (categoryName: string, productCount: number) => ({
    title: `${categoryName} - Professional HVAC Equipment`,
    description: `Professional ${categoryName.toLowerCase()} for HVAC and refrigeration systems. ${productCount} products available with technical specifications and expert support.`,
    keywords: `${categoryName.toLowerCase()}, HVAC ${categoryName.toLowerCase()}, professional ${categoryName.toLowerCase()}, commercial ${categoryName.toLowerCase()}`
  }),
  
  about: {
    title: 'About Us - Industrial HVAC Solutions',
    description: 'Over 25 years of experience providing professional HVAC and refrigeration equipment. Meet our expert team and learn about our commitment to quality and service.',
    keywords: 'HVAC company, refrigeration specialists, HVAC expertise, technical support, professional team'
  },
  
  contact: {
    title: 'Contact Us - Technical Support & Sales',
    description: 'Get expert technical support and sales assistance for your HVAC and refrigeration projects. Call 1-800-HVAC-PRO or email our professional team.',
    keywords: 'HVAC support, technical assistance, HVAC sales, equipment consultation, customer service'
  }
}

export default SEOHead