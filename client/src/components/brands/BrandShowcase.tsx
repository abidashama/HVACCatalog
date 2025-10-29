import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { gsap } from 'gsap'
import { 
  Shield, Award, Globe, Zap, Settings, Wind, 
  Droplets, Thermometer, CheckCircle, ArrowRight,
  ChevronLeft, ChevronRight, Play, Pause, Droplet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BrandSlide {
  id: string
  name: string
  tagline: string
  heroText: string
  description: string
  highlights: string[]
  stats?: { label: string; value: number; suffix?: string }[]
  certifications?: string[]
  applications?: string[]
  cta: string
  ctaLink: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  icon: typeof Shield
}

const brandSlides: BrandSlide[] = [
  {
    id: 'axeon',
    name: 'Axeon',
    tagline: 'Your Premium HVAC Partner',
    heroText: 'Quality Imported Solutions, Competitive Prices',
    description: 'Premium refrigeration and HVAC products tailored to your needs',
    highlights: ['Refrigeration', 'HVAC Products', 'Custom Solutions', 'Dedicated Support'],
    stats: [
      { label: 'Product Range', value: 500, suffix: '+' },
      { label: 'Satisfied Clients', value: 1000, suffix: '+' },
      { label: 'Support Response', value: 24, suffix: 'h' }
    ],
    cta: 'Get Your Custom Solution',
    ctaLink: '/contact',
    colors: {
      primary: '#002C5C',
      secondary: '#003870',
      accent: '#00AEEF'
    },
    icon: Droplet
  },
  {
    id: 'lefoo',
    name: 'Lefoo',
    tagline: 'Mastery in Precision Control Since 2000',
    heroText: '130+ Patents, 80+ Countries, Infinite Trust',
    description: 'Global leader in pressure switches, valves, and flow switches',
    highlights: ['Pressure Switches', 'Valves', 'Flow Switches'],
    stats: [
      { label: 'Years of Excellence', value: 23, suffix: '+' },
      { label: 'Patents', value: 130, suffix: '+' },
      { label: 'Countries', value: 80, suffix: '+' }
    ],
    cta: 'Explore Lefoo Solutions',
    ctaLink: '/products?brand=lefoo',
    colors: {
      primary: '#D62828',
      secondary: '#C41E1E',
      accent: '#FF6B6B'
    },
    icon: Settings
  },
  {
    id: 'invotech',
    name: 'Invotech',
    tagline: '15+ Years of Scroll Technology Excellence',
    heroText: 'Powering Innovation Across 30+ Countries',
    description: 'Specialists in scroll compressors and technical consulting services',
    highlights: ['Scroll Compressors', 'Technical Consulting'],
    stats: [
      { label: 'Years Experience', value: 15, suffix: '+' },
      { label: 'Countries Served', value: 30, suffix: '+' },
      { label: 'Solutions Delivered', value: 500, suffix: '+' }
    ],
    cta: 'Discover Invotech Technology',
    ctaLink: '/products?brand=invotech',
    colors: {
      primary: '#00a896',
      secondary: '#02c39a',
      accent: '#05668D'
    },
    icon: Zap
  }
]

interface BrandShowcaseProps {
  autoPlayInterval?: number
  enableAutoPlay?: boolean
}

export default function BrandShowcase({ 
  autoPlayInterval = 7000,
  enableAutoPlay = true 
}: BrandShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(enableAutoPlay)
  const [isHovered, setIsHovered] = useState(false)
  const [, setLocation] = useLocation()
  
  const slideRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRefs = useRef<(HTMLSpanElement | null)[]>([])
  const backgroundRef = useRef<HTMLDivElement>(null)
  const [bgOpacity, setBgOpacity] = useState(1)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentBrand = brandSlides[currentSlide]

  // Animated number counter
  const animateNumber = (element: HTMLElement, target: number, suffix: string = '') => {
    gsap.to(
      { val: 0 },
      {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          element.textContent = Math.ceil(this.targets()[0].val) + suffix
        }
      }
    )
  }

  // Slide transition animations
  const animateSlideTransition = (
    direction: 'next' | 'prev' | 'direct'
  ) => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    const tl = gsap.timeline()
    timelineRef.current = tl

    // Animate out current content (fade down)
    tl.to(contentRef.current, {
      opacity: 0,
      y: direction === 'prev' ? 50 : -50,
      duration: 0.4,
      ease: 'power2.in'
    })

    // Animate in new content
    tl.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: direction === 'prev' ? -50 : 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        onStart: () => {
          // Animate stats numbers
          if (currentBrand.stats) {
            statsRefs.current.forEach((ref, index) => {
              if (ref && currentBrand.stats) {
                const stat = currentBrand.stats[index]
                animateNumber(ref, stat.value, stat.suffix || '')
              }
            })
          }
        }
      }
    )

    return tl
  }

  // Navigate to slide
  const goToSlide = (index: number) => {
    if (index === currentSlide) return
    const direction = index > currentSlide ? 'next' : 'prev'
    // switch slide; soften background change by starting at 70% opacity then ramp up
    setCurrentSlide(index)
    setBgOpacity(0.5)
    requestAnimationFrame(() => setBgOpacity(1))
    // content transition
    animateSlideTransition(direction)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % brandSlides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + brandSlides.length) % brandSlides.length)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide()
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
    }
  }, [isPlaying, isHovered, currentSlide])

  // Initial animation
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
    }

    // Animate initial stats
    if (currentBrand.stats) {
      statsRefs.current.forEach((ref, index) => {
        if (ref && currentBrand.stats) {
          const stat = currentBrand.stats[index]
          setTimeout(() => {
            animateNumber(ref, stat.value, stat.suffix || '')
          }, 500 + index * 200)
        }
      })
    }
  }, [])

  const handleCTA = () => {
    setLocation(currentBrand.ctaLink)
  }

  return (
    <section 
      id="brand-hero"
      ref={slideRef}
      className="relative overflow-clip min-h-[620px] md:min-h-[700px] lg:h-[100vh] xl:h-[780px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spacer to offset fixed header height */}
      <div style={{ height: 'var(--header-height, 80px)' }} aria-hidden />
      {/* Dynamic Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 transition-opacity duration-700 delay-100"
        style={{
          opacity: bgOpacity,
          background: `linear-gradient(135deg, ${currentBrand.colors.primary} 0%, ${currentBrand.colors.secondary} 50%, ${currentBrand.colors.primary} 100%)`
        }}
      >
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          {currentBrand.id === 'lefoo' && (
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse" />
          )}
          {currentBrand.id === 'invotech' && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-[wave_3s_ease-in-out_infinite]" />
            </div>
          )}
          {currentBrand.id === 'axeon' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14 pb-36 md:pb-40 lg:pb-44 xl:pb-48 2xl:pb-52 flex items-center">
        <div ref={contentRef} className="w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-4 md:space-y-5">
            {/* Tagline */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white/80">{currentBrand.tagline}</h3>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {currentBrand.heroText}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                {currentBrand.description}
              </p>
            </div>

            {/* Stats Counter */}
            {currentBrand.stats && (
              <div className="flex flex-wrap gap-6">
                {currentBrand.stats.map((stat, index) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-3xl md:text-4xl font-bold">
                      <span ref={el => statsRefs.current[index] = el}>0</span>
                    </div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Highlights */}
            <div className="flex flex-wrap gap-2">
              {currentBrand.highlights.map((highlight, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  {highlight}
                </Badge>
              ))}
            </div>

            {/* Certifications */}
            {currentBrand.certifications && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {currentBrand.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="group relative px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold text-white hover:bg-white/20 hover:scale-105 transition-all cursor-pointer"
                      title={cert}
                    >
                      {cert}
                      <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/10 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            {currentBrand.applications && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Applications</h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentBrand.applications.map((app, index) => {
                    const icons = [Thermometer, Wind, Droplets, Settings]
                    const Icon = icons[index % icons.length]
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all group"
                      >
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-xs font-medium leading-tight">{app}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={handleCTA}
              className="group bg-white hover:bg-white/90 shadow-2xl h-12 md:h-14 text-base md:text-lg font-bold transition-all hover:scale-105"
              style={{ color: currentBrand.colors.primary }}
            >
              {currentBrand.cta}
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Column - Visual Element */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-full min-h-[22rem]">
              {/* Floating elements based on brand */}
              {currentBrand.id === 'lefoo' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"
                        style={{
                          animationDuration: `${3 + i}s`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Settings className="w-32 h-32 text-white/80 animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                  </div>
                </div>
              )}
              {currentBrand.id === 'invotech' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"
                        style={{
                          animationDuration: `${3 + i}s`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-32 h-32 text-white/80" />
                    </div>
                  </div>
                </div>
              )}
              {currentBrand.id === 'axeon' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"
                        style={{
                          animationDuration: `${3 + i}s`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Droplet className="w-32 h-32 text-white/80" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            {/* Brand Logo Navigation */}
            <div className="flex items-center gap-2 sm:gap-4">
              {brandSlides.map((brand, index) => {
                const BrandIcon = brand.icon
                return (
                  <button
                    key={brand.id}
                    onClick={() => goToSlide(index)}
                    className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm border transition-all ${
                      currentSlide === index
                        ? 'bg-white/20 border-white/40 scale-110'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <BrandIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-white font-semibold text-xs sm:text-sm hidden sm:inline">{brand.name}</span>
                    {currentSlide === index && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Arrow Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={prevSlide}
                className="h-9 w-9 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-9 w-9 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={nextSlide}
                className="h-9 w-9 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-white transition-all"
          style={{
            width: `${((currentSlide + 1) / brandSlides.length) * 100}%`
          }}
        />
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  )
}

