import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { Filter, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FilterSidebar from '@/components/filters/FilterSidebar'
import ProductGrid from '@/components/products/ProductGrid'
import ProductCard from '@/components/products/ProductCard'
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProductFilters } from '@shared/schema'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import pressureSwitchData from '@/assets/data/pressure-switch.json'
import valveData from '@/assets/data/valves.json'
import pressureTransmitterData from '@/assets/data/pressure_transmitters.json'
import heatExchangerData from '@/assets/data/heat_exchangers.json'
import axeonValveData from '@/assets/data/axeon_valves.json'
import accumulatorData from '@/assets/data/accumulator_oil_seperator_liquid_receiver.json'
import fansData from '@/assets/data/axial_fans_shaded_poles_small_fans.json'
import filterDrierData from '@/assets/data/filter_driers_filter_drier_shell.json'
import pressureGaugeData from '@/assets/data/pressure_gauge_manifold_gauge.json'

gsap.registerPlugin(ScrollTrigger)

// Constant for consistent URL encoding
const PRESSURE_SWITCHES_URL = '/products?category=Pressure%20Switches'

interface PressureSwitchSubcategory {
  id: string
  name: string
  description: string
  image: string
  modelNumber: string
  productCount: number
  certifications: string[]
  connection?: string
}

export default function ProductsPage() {
  const [location, setLocation] = useLocation()
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Partial<ProductFilters>>({})
  const [showSubcategories, setShowSubcategories] = useState(false)
  const [subcategoryType, setSubcategoryType] = useState<'pressure-switches' | 'valves' | 'pressure-transmitters' | 'filter-driers' | 'pressure-gauge' | null>(null)
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Build subcategories from JSON as product-like objects - directly reading image from JSON
  const subcategories: PressureSwitchSubcategory[] = [
    {
      id: 'waterline',
      name: 'Pressure Switch for Waterline',
      description: 'Professional water line pressure switches with wide pressure ranges',
      image: (pressureSwitchData.categories.pressureSwitches as any).image,
      modelNumber: 'LF55 Series',
      productCount: (pressureSwitchData.categories.pressureSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.pressureSwitches?.certifications || [],
      connection: pressureSwitchData.categories.pressureSwitches?.connection
    },
    {
      id: 'refrigeration',
      name: 'LP & HP Refrigeration Switches',
      description: 'Low and high pressure switches for refrigeration systems',
      image: (pressureSwitchData.categories.lpHpRefrigerationSwitches as any).image,
      modelNumber: 'LF55 Series',
      productCount: (pressureSwitchData.categories.lpHpRefrigerationSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.lpHpRefrigerationSwitches?.certifications || [],
      connection: pressureSwitchData.categories.lpHpRefrigerationSwitches?.connection
    },
    {
      id: 'combined',
      name: 'LP-HP Combined Switches',
      description: 'Combined low and high pressure switch units',
      image: (pressureSwitchData.categories.lpHpCombinedSwitches as any).image,
      modelNumber: 'LF58 Series',
      productCount: (pressureSwitchData.categories.lpHpCombinedSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.lpHpCombinedSwitches?.certifications || [],
      connection: pressureSwitchData.categories.lpHpCombinedSwitches?.connection
    },
    {
      id: 'differential',
      name: 'Small Fix Differential Switches',
      description: 'Cartridge type differential pressure switches',
      image: (pressureSwitchData.categories.smallFixDifferentialSwitches as any).image,
      modelNumber: 'LF08 Series',
      productCount: 1, // Single model with multiple ranges
      certifications: pressureSwitchData.categories.smallFixDifferentialSwitches?.certifications || [],
      connection: pressureSwitchData.categories.smallFixDifferentialSwitches?.connection
    },
    {
      id: 'oil',
      name: 'Oil Differential Switches',
      description: 'Oil differential pressure switches for compressor protection',
      image: (pressureSwitchData.categories.oilDifferentialSwitches as any).image,
      modelNumber: 'LF5D Series',
      productCount: (pressureSwitchData.categories.oilDifferentialSwitches?.products as Array<{model: string, range: string}>)?.length || 0,
      certifications: pressureSwitchData.categories.oilDifferentialSwitches?.certifications || [],
      connection: pressureSwitchData.categories.oilDifferentialSwitches?.connection
    },
    {
      id: 'air',
      name: 'Air Differential Switches',
      description: 'Air differential pressure switches for HVAC systems',
      image: (pressureSwitchData.categories.airDifferentialSwitches as any).image,
      modelNumber: 'LF32 Series',
      productCount: (pressureSwitchData.categories.airDifferentialSwitches?.products as Array<{model: string, range: string | string[]}>)?.length || 0,
      certifications: pressureSwitchData.categories.airDifferentialSwitches?.certifications || []
    }
  ]

  // Build valve subcategories from JSON
  const valveSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'solenoid-lfsv-d',
      name: 'Solenoid Valve & Coil LFSV-D',
      description: 'Small and big body solenoid valves with coils for refrigeration',
      image: (valveData.categories.solenoidValvesLFSVD as any).image,
      modelNumber: 'LFSV-D Series',
      productCount: Object.values((valveData.categories.solenoidValvesLFSVD as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: []
    },
    {
      id: 'solenoid-lfsv-k',
      name: 'Solenoid Valve LFSV-K',
      description: 'Small and big body solenoid valves for HVAC applications',
      image: (valveData.categories.solenoidValvesLFSVK as any).image,
      modelNumber: 'LFSV-K Series',
      productCount: Object.values((valveData.categories.solenoidValvesLFSVK as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: []
    },
    {
      id: 'expansion',
      name: 'Expansion Valve',
      description: 'Thermostatic expansion valves for various refrigerants',
      image: (valveData.categories.expansionValves as any).image,
      modelNumber: 'TX/TEX Series',
      productCount: (valveData.categories.expansionValves?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'expansion-brazing',
      name: 'Expansion Valve Brazing Type',
      description: 'Brazing type expansion valves with various capacities',
      image: (valveData.categories.expansionValvesBrazing as any).image,
      modelNumber: 'LFTGEX Series',
      productCount: (valveData.categories.expansionValvesBrazing?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'solenoid-lffdf',
      name: 'Solenoid Valve LFFDF',
      description: 'Compact solenoid valves for refrigeration systems',
      image: (valveData.categories.solenoidValvesLFFDF as any).image,
      modelNumber: 'LFFDF Series',
      productCount: (valveData.categories.solenoidValvesLFFDF?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'bypass',
      name: 'Bypass Valve LFDBV',
      description: 'Bypass valves for refrigeration capacity control',
      image: (valveData.categories.bypassValves as any).image,
      modelNumber: 'LFDBV Series',
      productCount: (valveData.categories.bypassValves?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'ball',
      name: 'Ball Valve',
      description: 'Ball valves with and without port for refrigeration lines',
      image: (valveData.categories.ballValves as any).image,
      modelNumber: 'LFBV Series',
      productCount: Object.values((valveData.categories.ballValves as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: (valveData.categories.ballValves as any).certifications || []
    },
    {
      id: 'flow-switch',
      name: 'Flow Switch',
      description: 'Flow switches for monitoring water flow in HVAC systems',
      image: (valveData.categories.flowSwitches as any).image,
      modelNumber: 'FS Series',
      productCount: (valveData.categories.flowSwitches?.products as Array<any>)?.length || 0,
      certifications: (valveData.categories.flowSwitches as any).certifications || []
    },
    {
      id: 'sight-glass',
      name: 'Sight Glass',
      description: 'Sight glasses for visual refrigerant inspection',
      image: (valveData.categories.sightGlass as any).image,
      modelNumber: 'LFSG Series',
      productCount: Object.values((valveData.categories.sightGlass as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: (valveData.categories.sightGlass as any).certifications || []
    }
  ]

  // Build pressure transmitter subcategories from JSON
  const pressureTransmitterSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 't2000-series',
      name: 'T2000 Series',
      description: 'High-precision pressure transmitters with 4-20 mA output',
      image: (pressureTransmitterData.categories.t2000Series as any).image,
      modelNumber: 'T2000 Series',
      productCount: (pressureTransmitterData.categories.t2000Series?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 't2800-series',
      name: 'T2800 Series',
      description: 'Pressure transmitters with negative pressure capability',
      image: (pressureTransmitterData.categories.t2800Series as any).image,
      modelNumber: 'T2800 Series',
      productCount: (pressureTransmitterData.categories.t2800Series?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build heat exchanger subcategories from JSON
  const heatExchangerSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'bphe',
      name: 'Heat Exchanger/BPHE',
      description: 'Brazed plate heat exchangers for HVAC and refrigeration systems',
      image: (heatExchangerData.categories.heatExchangerBPHE as any).image,
      modelNumber: 'BPHE Series',
      productCount: (heatExchangerData.categories.heatExchangerBPHE?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build axeon valve subcategories from JSON
  const axeonValveSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'rotalock',
      name: 'Rotalock Valve',
      description: 'Rotalock service valves for refrigeration systems',
      image: (axeonValveData.categories.rotalockValves as any).image,
      modelNumber: 'AX Series',
      productCount: (axeonValveData.categories.rotalockValves?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'hand-shutoff',
      name: 'Hand Shutoff Valve',
      description: 'Manual shutoff valves for refrigeration lines',
      image: (axeonValveData.categories.handShutoffValves as any).image,
      modelNumber: 'HV Series',
      productCount: (axeonValveData.categories.handShutoffValves?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'angle',
      name: 'Angle Valve',
      description: 'Angle valves for refrigeration applications',
      image: (axeonValveData.categories.angleValves as any).image,
      modelNumber: 'SV Series',
      productCount: (axeonValveData.categories.angleValves?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'solenoid-waterline',
      name: 'Solenoid Valve (Waterline)',
      description: 'Solenoid valves for waterline applications',
      image: (axeonValveData.categories.solenoidValvesWaterline as any).image,
      modelNumber: 'YC Series',
      productCount: Object.values((axeonValveData.categories.solenoidValvesWaterline as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: []
    }
  ]

  // Build accumulator/oil separator/liquid receiver subcategories from JSON
  const accumulatorSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'accumulator',
      name: 'Liquid Accumulator',
      description: 'Suction line accumulators for refrigeration systems',
      image: (accumulatorData.categories.liquidAccumulator as any).image,
      modelNumber: 'SPLQ Series',
      productCount: (accumulatorData.categories.liquidAccumulator?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'oil-separator',
      name: 'Oil Separator',
      description: 'Oil separators for refrigeration compressors',
      image: (accumulatorData.categories.oilSeparator as any).image,
      modelNumber: 'SPLY Series',
      productCount: (accumulatorData.categories.oilSeparator?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'liquid-receiver',
      name: 'Liquid Receiver',
      description: 'Liquid receivers for refrigeration systems',
      image: (accumulatorData.categories.liquidReceiver as any).image,
      modelNumber: 'SPLC Series',
      productCount: (accumulatorData.categories.liquidReceiver?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build fans subcategories from JSON
  const fansSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'axial-fans',
      name: 'Axial Fans',
      description: 'High-performance axial fans for refrigeration and HVAC systems',
      image: (fansData.categories.axialFans as any).image,
      modelNumber: 'AX Series',
      productCount: Object.values((fansData.categories.axialFans as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: []
    },
    {
      id: 'small-fans',
      name: 'Small Fans',
      description: 'Compact fans for various cooling applications',
      image: (fansData.categories.smallFans as any).image,
      modelNumber: 'AX Series',
      productCount: (fansData.categories.smallFans?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'shaded-pole-motor',
      name: 'Shaded Pole Motor',
      description: 'Shaded pole motors for HVAC applications',
      image: (fansData.categories.shadedPoleMotor as any).image,
      modelNumber: 'AX Series',
      productCount: (fansData.categories.shadedPoleMotor?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build filter drier subcategories from JSON
  const filterDrierSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'filter-driers',
      name: 'Filter Driers',
      description: 'High-quality filter driers with flare and solder connections',
      image: (filterDrierData.categories.filterDriers as any).image,
      modelNumber: 'SEK Series',
      productCount: (filterDrierData.categories.filterDriers?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'filter-drier-shell',
      name: 'Filter Drier Shell',
      description: 'Filter drier shells with single and double core options',
      image: (filterDrierData.categories.filterDrierShell as any).image,
      modelNumber: 'SPL Series',
      productCount: (filterDrierData.categories.filterDrierShell?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build pressure gauge subcategories from JSON
  const pressureGaugeSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'pressure-gauges',
      name: 'Pressure Gauges',
      description: 'High-precision pressure gauges with back and bottom connections',
      image: (pressureGaugeData.categories.pressureGauges as any).image,
      modelNumber: 'Pressure Gauge Series',
      productCount: (pressureGaugeData.categories.pressureGauges?.products as Array<any>)?.length || 0,
      certifications: []
    },
    {
      id: 'manifold-gauges',
      name: 'Manifold Gauges',
      description: 'Single manifold gauges for refrigeration systems',
      image: (pressureGaugeData.categories.manifoldGauges as any).image,
      modelNumber: 'CT Series',
      productCount: (pressureGaugeData.categories.manifoldGauges?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]
  
  // Parse URL parameters on component mount and when URL changes
  useEffect(() => {
    const parseUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const initialFilters: Partial<ProductFilters> = {}
      
      if (urlParams.get('search')) {
        setSearchQuery(urlParams.get('search') || '')
        initialFilters.search = urlParams.get('search') || undefined
      }
      
      if (urlParams.get('category')) {
        const category = urlParams.get('category') || undefined
        initialFilters.category = category
        // Show subcategories if Pressure Switches, Valves, Pressure Transmitters, or Filter Driers is selected
        const isPressureSwitches = category?.trim().toLowerCase() === 'pressure switches'
        const isValves = category?.trim().toLowerCase() === 'valves'
        const isPressureTransmitters = category?.trim().toLowerCase() === 'pressure transmitters'
        const isFilterDriers = category?.trim().toLowerCase() === 'filter driers/filter drier shell'
        const isPressureGauge = category?.trim().toLowerCase() === 'pressure gauge/manifold gauge'
        setShowSubcategories(isPressureSwitches || isValves || isPressureTransmitters || isFilterDriers || isPressureGauge)
        if (isPressureSwitches) {
          setSubcategoryType('pressure-switches')
        } else if (isValves) {
          setSubcategoryType('valves')
        } else if (isPressureTransmitters) {
          setSubcategoryType('pressure-transmitters')
        } else if (isFilterDriers) {
          setSubcategoryType('filter-driers')
        } else if (isPressureGauge) {
          setSubcategoryType('pressure-gauge')
        } else {
          setSubcategoryType(null)
        }
      } else {
        setShowSubcategories(false)
        setSubcategoryType(null)
      }
      
      if (urlParams.get('series')) {
        initialFilters.series = urlParams.get('series') || undefined
      }
      
      if (urlParams.get('priceMin')) {
        initialFilters.priceMin = parseFloat(urlParams.get('priceMin') || '0')
      }
      
      if (urlParams.get('priceMax')) {
        initialFilters.priceMax = parseFloat(urlParams.get('priceMax') || '0')
      }
      
      if (urlParams.get('stockStatus')) {
        const status = urlParams.get('stockStatus')
        if (status === 'in_stock' || status === 'low_stock' || status === 'out_of_stock' || status === 'on_order') {
          initialFilters.stockStatus = status
        }
      }
      
      setFilters(initialFilters)
    }
    
    // Parse on mount and location change
    parseUrlParams()
    
    // Listen for browser back/forward navigation
    const handlePopState = () => {
      parseUrlParams()
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [location])
  
  const handleSearch = () => {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (searchQuery.trim()) {
      urlParams.set('search', searchQuery.trim())
      setFilters(prev => ({ ...prev, search: searchQuery.trim() }))
    } else {
      urlParams.delete('search')
      setFilters(prev => ({ ...prev, search: undefined }))
    }
    
    // Update URL without navigating
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newUrl)
  }
  
  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    // Reset to page 1 when filters change to prevent empty results
    const filtersWithReset = { ...newFilters, page: 1 }
    setFilters(filtersWithReset)
    
    // Check if Pressure Switches, Valves, Pressure Transmitters, or Filter Driers is selected
    const isPressureSwitches = newFilters.category?.trim().toLowerCase() === 'pressure switches'
    const isValves = newFilters.category?.trim().toLowerCase() === 'valves'
    const isPressureTransmitters = newFilters.category?.trim().toLowerCase() === 'pressure transmitters'
    const isFilterDriers = newFilters.category?.trim().toLowerCase() === 'filter driers/filter drier shell'
    const isPressureGauge = newFilters.category?.trim().toLowerCase() === 'pressure gauge/manifold gauge'
    setShowSubcategories(isPressureSwitches || isValves || isPressureTransmitters || isFilterDriers || isPressureGauge)
    if (isPressureSwitches) {
      setSubcategoryType('pressure-switches')
    } else if (isValves) {
      setSubcategoryType('valves')
    } else if (isPressureTransmitters) {
      setSubcategoryType('pressure-transmitters')
    } else if (isFilterDriers) {
      setSubcategoryType('filter-driers')
    } else if (isPressureGauge) {
      setSubcategoryType('pressure-gauge')
    } else {
      setSubcategoryType(null)
    }
    
    // Update URL parameters
    const urlParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.set(key, value.toString())
      }
    })
    
    if (searchQuery.trim()) {
      urlParams.set('search', searchQuery.trim())
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newUrl)
  }

  const handleSubcategoryClick = (subcategoryId: string, categoryType?: string) => {
    // Determine category type from subcategoryId if not provided
    const type = categoryType || (() => {
      if (subcategories.find(s => s.id === subcategoryId)) return 'pressure-switches'
      if (valveSubcategories.find(s => s.id === subcategoryId)) return 'valves'
      if (pressureTransmitterSubcategories.find(s => s.id === subcategoryId)) return 'pressure-transmitters'
      if (filterDrierSubcategories.find(s => s.id === subcategoryId)) return 'filter-driers'
      if (pressureGaugeSubcategories.find(s => s.id === subcategoryId)) return 'pressure-gauge'
      return subcategoryType
    })()
    
    if (type === 'pressure-switches') {
      setLocation(`/pressure-switches/${subcategoryId}`)
    } else if (type === 'valves') {
      setLocation(`/valves/${subcategoryId}`)
    } else if (type === 'pressure-transmitters') {
      setLocation(`/pressure-transmitters/${subcategoryId}`)
    } else if (type === 'filter-driers') {
      setLocation(`/filter-driers/${subcategoryId}`)
    } else if (type === 'pressure-gauge') {
      setLocation(`/pressure-gauge/${subcategoryId}`)
    } else if (subcategoryType === 'pressure-switches') {
      setLocation(`/pressure-switches/${subcategoryId}`)
    } else if (subcategoryType === 'valves') {
      setLocation(`/valves/${subcategoryId}`)
    } else if (subcategoryType === 'pressure-transmitters') {
      setLocation(`/pressure-transmitters/${subcategoryId}`)
    } else if (subcategoryType === 'filter-driers') {
      setLocation(`/filter-driers/${subcategoryId}`)
    } else if (subcategoryType === 'pressure-gauge') {
      setLocation(`/pressure-gauge/${subcategoryId}`)
    }
  }

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch)
    
    // Update URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    
    if (newSearch.trim()) {
      urlParams.set('search', newSearch.trim())
    } else {
      urlParams.delete('search')
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newUrl)
  }

  // GSAP Animations
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )

      // Search bar animation
      gsap.fromTo(searchRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      )

      // Main content animation
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power2.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div ref={heroRef} className="bg-muted py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            HVAC & Refrigeration Products
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Professional equipment for contractors, technicians, and engineers
          </p>
          
          {/* Search Bar */}
          <div ref={searchRef} className="max-w-2xl">
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search products, model numbers, specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-14 h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-product-search"
              />
              <Button 
                size="icon" 
                className="absolute right-2 -translate-x-1/2 h-12 w-12 bg-primary hover:bg-primary/90 z-10"
                onClick={handleSearch}
                data-testid="button-product-search"
              >
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 relative">
          {/* Filter Sidebar - LEFT SIDE - Always visible */}
          <SectionErrorBoundary fallbackTitle="Filters Unavailable">
            <FilterSidebar 
              isOpen={filterSidebarOpen} 
              onClose={() => setFilterSidebarOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </SectionErrorBoundary>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 lg:ml-0">
            {showSubcategories ? (
              /* Subcategory Cards - Using ProductCard component */
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {subcategoryType === 'pressure-switches' ? 'Pressure Switch Categories' : 
                       subcategoryType === 'valves' ? 'Valve Categories' : 
                       subcategoryType === 'pressure-transmitters' ? 'Pressure Transmitter Categories' : 
                       subcategoryType === 'filter-driers' ? 'Filter Driers/Filter Drier Shell Categories' : 
                       subcategoryType === 'pressure-gauge' ? 'Pressure Gauge/Manifold Gauge Categories' : 'Categories'}
                    </h2>
                    <p className="text-muted-foreground mt-1">Select a category to view products</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({})
                      setShowSubcategories(false)
                      setSubcategoryType(null)
                      setLocation('/products')
                    }}
                  >
                    View All Products
                  </Button>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                  {(subcategoryType === 'pressure-switches' ? subcategories : 
                    subcategoryType === 'valves' ? valveSubcategories : 
                    subcategoryType === 'pressure-transmitters' ? pressureTransmitterSubcategories : 
                    subcategoryType === 'filter-driers' ? filterDrierSubcategories : 
                    subcategoryType === 'pressure-gauge' ? pressureGaugeSubcategories : []).map((subcategory) => {
                    const categoryName = subcategoryType === 'pressure-switches' ? 'Pressure Switches' : 
                                       subcategoryType === 'valves' ? 'Valves' : 
                                       subcategoryType === 'pressure-transmitters' ? 'Pressure Transmitters' : 
                                       subcategoryType === 'filter-driers' ? 'Filter Driers/Filter Drier Shell' : 
                                       subcategoryType === 'pressure-gauge' ? 'Pressure Gauge/Manifold Gauge' : 'Products'
                    const linkPath = subcategoryType === 'pressure-switches' 
                      ? `/pressure-switches/${subcategory.id}` 
                      : subcategoryType === 'valves'
                      ? `/valves/${subcategory.id}`
                      : subcategoryType === 'pressure-transmitters'
                      ? `/pressure-transmitters/${subcategory.id}`
                      : subcategoryType === 'filter-driers'
                      ? `/filter-driers/${subcategory.id}`
                      : subcategoryType === 'pressure-gauge'
                      ? `/pressure-gauge/${subcategory.id}`
                      : `/products`
                    
                    return (
                      <ProductCard
                        key={subcategory.id}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category={categoryName}
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={linkPath}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                      />
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Show all categories when no filters are applied */
              !filters.category && !searchQuery ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Browse by Category</h2>
                    <p className="text-muted-foreground mt-1">Select a category to view products</p>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                    {/* Pressure Switches Categories */}
                    {subcategories.map((subcategory) => (
                      <ProductCard
                        key={`pressure-switch-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Pressure Switches"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/pressure-switches/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'pressure-switches')}
                      />
                    ))}

                    {/* Valves Categories */}
                    {valveSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`valve-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Valves"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/valves/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'valves')}
                      />
                    ))}

                    {/* Pressure Transmitters Categories */}
                    {pressureTransmitterSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`pressure-transmitter-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Pressure Transmitters"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/pressure-transmitters/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'pressure-transmitters')}
                      />
                    ))}

                    {/* Heat Exchangers Categories */}
                    {heatExchangerSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`heat-exchanger-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Heat Exchangers"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/heat-exchangers/${subcategory.id}`}
                        onClick={() => setLocation(`/heat-exchangers/${subcategory.id}`)}
                      />
                    ))}

                    {/* Axeon Valves Categories */}
                    {axeonValveSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`axeon-valve-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Axeon Valves"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/axeon-valves/${subcategory.id}`}
                        onClick={() => setLocation(`/axeon-valves/${subcategory.id}`)}
                      />
                    ))}

                    {/* Accumulator/Oil Separator/Liquid Receiver Categories */}
                    {accumulatorSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`accumulator-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Accumulator & Separators"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/accumulator/${subcategory.id}`}
                        onClick={() => setLocation(`/accumulator/${subcategory.id}`)}
                      />
                    ))}

                    {/* Fans Categories */}
                    {fansSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`fans-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Fans & Motors"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/fans/${subcategory.id}`}
                        onClick={() => setLocation(`/fans/${subcategory.id}`)}
                      />
                    ))}

                    {/* Filter Driers Categories */}
                    {filterDrierSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`filter-drier-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Filter Driers/Filter Drier Shell"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/filter-driers/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'filter-driers')}
                      />
                    ))}

                    {/* Pressure Gauge Categories */}
                    {pressureGaugeSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`pressure-gauge-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Pressure Gauge/Manifold Gauge"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/pressure-gauge/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'pressure-gauge')}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Regular Product Grid when filters/search are applied */
                <SectionErrorBoundary 
                  fallbackTitle="Products Unavailable"
                  fallbackMessage="Unable to load products. Please try refreshing the page."
                >
                  <ProductGrid 
                    filters={filters} 
                    searchQuery={searchQuery} 
                    onFiltersChange={handleFiltersChange}
                    onSearchChange={handleSearchChange}
                  />
                </SectionErrorBoundary>
              )
            )}
          </div>

          {/* Mobile Filter Button - Always visible */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Button
              onClick={() => setFilterSidebarOpen(true)}
              className="rounded-full shadow-lg h-12 px-6 active-elevate-2"
              data-testid="button-mobile-filter"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}