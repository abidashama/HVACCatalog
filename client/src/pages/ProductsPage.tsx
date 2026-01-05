import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { Filter } from 'lucide-react'
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
import flowSwitchData from '@/assets/data/flow_switch.json'
import pressureTransmitterData from '@/assets/data/pressure_transmitters.json'
import heatExchangerData from '@/assets/data/heat_exchangers.json'
import axeonValveData from '@/assets/data/axeon_valves.json'
import accumulatorData from '@/assets/data/accumulator_oil_seperator_liquid_receiver.json'
import fansData from '@/assets/data/axial_fans_shaded_poles_small_fans.json'
import filterDrierData from '@/assets/data/filter_driers_filter_drier_shell.json'
import pressureGaugeData from '@/assets/data/pressure_gauge_manifold_gauge.json'
import teflonTapeData from '@/assets/data/teflon_tape.json'
import axeonPumpsData from '@/assets/data/axeon_pumps.json'
import vibrationEliminatorsData from '@/assets/data/vibration_eliminators.json'
import brazingRodData from '@/assets/data/brazing_rod.json'
import relayData from '@/assets/data/relay.json'
import scrollCompressorData from '@/assets/data/scroll_compressor.json'

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
  const [subcategoryType, setSubcategoryType] = useState<'pressure-switches' | 'valves' | 'flow-switches' | 'pressure-transmitters' | 'filter-driers' | 'pressure-gauge' | 'teflon-tape' | 'axeon-pumps' | 'vibration-eliminators' | 'brazing-rod' | 'relay' | 'scroll-compressors' | null>(null)
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
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
      id: 'sight-glass',
      name: 'Sight Glass',
      description: 'Sight glasses for visual refrigerant inspection',
      image: (valveData.categories.sightGlass as any).image,
      modelNumber: 'LFSG Series',
      productCount: Object.values((valveData.categories.sightGlass as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: (valveData.categories.sightGlass as any).certifications || []
    }
  ]

  // Build flow switch subcategories from JSON
  const flowSwitchSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'eco',
      name: 'ECO Flow Switch',
      description: 'ECO series flow switches for cost-effective monitoring',
      image: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.ecoFlowSwitch as any)?.image,
      modelNumber: 'FS51-ECO',
      productCount: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.ecoFlowSwitch?.products as Array<any>)?.length || 0,
      certifications: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.ecoFlowSwitch as any)?.certifications || [],
      connection: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.ecoFlowSwitch as any)?.connection
    },
    {
      id: 'fs51-11',
      name: 'FS51-11 Flow Switch',
      description: 'Standard flow switches for reliable flow monitoring',
      image: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs5111 as any)?.image,
      modelNumber: 'FS51-11',
      productCount: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs5111?.products as Array<any>)?.length || 0,
      certifications: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs5111 as any)?.certifications || [],
      connection: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs5111 as any)?.connection
    },
    {
      id: 'fs52',
      name: 'FS52 Flow Switch',
      description: 'Advanced flow switches with enhanced precision',
      image: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs52 as any)?.image,
      modelNumber: 'FS52',
      productCount: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs52?.products as Array<any>)?.length || 0,
      certifications: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs52 as any)?.certifications || [],
      connection: ((flowSwitchData.categories.flowSwitches as any)?.subcategories?.fs52 as any)?.connection
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
      certifications: (pressureTransmitterData.categories.t2000Series as any).certifications || []
    },
    {
      id: 't2800-series',
      name: 'T2800 Series',
      description: 'Pressure transmitters with negative pressure capability',
      image: (pressureTransmitterData.categories.t2800Series as any).image,
      modelNumber: 'T2800 Series',
      productCount: (pressureTransmitterData.categories.t2800Series?.products as Array<any>)?.length || 0,
      certifications: (pressureTransmitterData.categories.t2800Series as any).certifications || []
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

  // Build teflon tape subcategories from JSON
  const teflonTapeSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'teflon-tape',
      name: 'Teflon Tape',
      description: 'High-quality teflon tape for sealing and threading applications',
      image: (teflonTapeData.categories.teflonTape as any).image,
      modelNumber: 'Teflon Tape Series',
      productCount: (teflonTapeData.categories.teflonTape?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build axeon pumps subcategories from JSON
  const axeonPumpsSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'self-priming-pump-ss',
      name: 'Axeon Self Priming Pump (SS)',
      description: 'Self-priming stainless steel pumps for water supply',
      image: (axeonPumpsData.categories.selfPrimingPumpSS as any).image,
      modelNumber: 'JETS Series',
      productCount: Object.values((axeonPumpsData.categories.selfPrimingPumpSS as any).subcategories || {}).reduce((total: number, sub: any) => total + (sub.products?.length || 0), 0),
      certifications: []
    },
    {
      id: 'multistage-pump',
      name: 'Multistage Pump',
      description: 'High-performance multistage pumps for industrial use',
      image: (axeonPumpsData.categories.multistagePump as any).image,
      modelNumber: 'Multistage Series',
      productCount: (axeonPumpsData.categories.multistagePump?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build vibration eliminators subcategories from JSON
  const vibrationEliminatorsSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'vibration-eliminators',
      name: 'Vibration Eliminators',
      description: 'High-quality vibration eliminators for noise and vibration reduction',
      image: (vibrationEliminatorsData.categories.vibrationEliminators as any).image,
      modelNumber: 'SVA Series',
      productCount: (vibrationEliminatorsData.categories.vibrationEliminators?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  const brazingRodSubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'brazing-rod',
      name: 'Brazing Rod',
      description: 'High-quality brazing rods for joining metal components',
      image: (brazingRodData.categories.brazingRod as any).image,
      modelNumber: 'AXEON-0 BCUP-2',
      productCount: (brazingRodData.categories.brazingRod?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  const relaySubcategories: PressureSwitchSubcategory[] = [
    {
      id: 'relay',
      name: 'Relay',
      description: 'High-performance relays for electrical control and switching',
      image: (relayData.categories.relay as any).image,
      modelNumber: 'GR3800-3F3C-4',
      productCount: (relayData.categories.relay?.products as Array<any>)?.length || 0,
      certifications: []
    }
  ]

  // Build scroll compressor single category from JSON
  const scrollCompressorCategory: PressureSwitchSubcategory = {
    id: 'scroll-compressors',
    name: 'Scroll Compressors',
    description: 'High-efficiency scroll compressors for chiller and heat pump applications',
    image: (scrollCompressorData.categories.scrollCompressors as any).image,
    modelNumber: 'INVOTECH',
    productCount: (((scrollCompressorData.categories.scrollCompressors as any).subcategories.chiller?.products as Array<any>)?.length || 0) + 
                  (((scrollCompressorData.categories.scrollCompressors as any).subcategories.heatPump?.products as Array<any>)?.length || 0),
    certifications: []
  }
  
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
        
        // Show subcategories if Pressure Switches, Valves, Flow Switches, Pressure Transmitters, or Filter Driers is selected
        const isPressureSwitches = category?.trim().toLowerCase() === 'pressure switches'
        const isValves = category?.trim().toLowerCase() === 'valves'
        const isFlowSwitches = category?.trim().toLowerCase() === 'flow switches'
        const isPressureTransmitters = category?.trim().toLowerCase() === 'pressure transmitters'
        const isFilterDriers = category?.trim().toLowerCase() === 'filter driers/filter drier shell'
        const isPressureGauge = category?.trim().toLowerCase() === 'pressure gauge/manifold gauge'
        const isTeflonTape = category?.trim().toLowerCase() === 'teflon tape'
        const isAxeonPumps = category?.trim().toLowerCase() === 'axeon pumps'
        const isVibrationEliminators = category?.trim().toLowerCase() === 'vibration eliminators'
        const isBrazingRod = category?.trim().toLowerCase() === 'brazing rod'
        const isRelay = category?.trim().toLowerCase() === 'relay'
        const isScrollCompressors = category?.trim().toLowerCase() === 'scroll compressors'
        setShowSubcategories(isPressureSwitches || isValves || isFlowSwitches || isPressureTransmitters || isFilterDriers || isPressureGauge || isTeflonTape || isAxeonPumps || isVibrationEliminators || isBrazingRod || isRelay || isScrollCompressors)
        if (isPressureSwitches) {
          setSubcategoryType('pressure-switches')
        } else if (isValves) {
          setSubcategoryType('valves')
        } else if (isFlowSwitches) {
          setSubcategoryType('flow-switches')
        } else if (isPressureTransmitters) {
          setSubcategoryType('pressure-transmitters')
        } else if (isFilterDriers) {
          setSubcategoryType('filter-driers')
        } else if (isPressureGauge) {
          setSubcategoryType('pressure-gauge')
        } else if (isTeflonTape) {
          setSubcategoryType('teflon-tape')
        } else if (isAxeonPumps) {
          setSubcategoryType('axeon-pumps')
        } else if (isVibrationEliminators) {
          setSubcategoryType('vibration-eliminators')
        } else if (isBrazingRod) {
          setSubcategoryType('brazing-rod')
        } else if (isRelay) {
          setSubcategoryType('relay')
        } else if (isScrollCompressors) {
          setSubcategoryType('scroll-compressors')
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
    
    // Check if Pressure Switches, Valves, Flow Switches, Pressure Transmitters, or Filter Driers is selected
    const isPressureSwitches = newFilters.category?.trim().toLowerCase() === 'pressure switches'
    const isValves = newFilters.category?.trim().toLowerCase() === 'valves'
    const isFlowSwitches = newFilters.category?.trim().toLowerCase() === 'flow switches'
    const isPressureTransmitters = newFilters.category?.trim().toLowerCase() === 'pressure transmitters'
    const isFilterDriers = newFilters.category?.trim().toLowerCase() === 'filter driers/filter drier shell'
    const isPressureGauge = newFilters.category?.trim().toLowerCase() === 'pressure gauge/manifold gauge'
    const isTeflonTape = newFilters.category?.trim().toLowerCase() === 'teflon tape'
    const isAxeonPumps = newFilters.category?.trim().toLowerCase() === 'axeon pumps'
    const isVibrationEliminators = newFilters.category?.trim().toLowerCase() === 'vibration eliminators'
    const isBrazingRod = newFilters.category?.trim().toLowerCase() === 'brazing rod'
    const isRelay = newFilters.category?.trim().toLowerCase() === 'relay'
    const isScrollCompressors = newFilters.category?.trim().toLowerCase() === 'scroll compressors'
    setShowSubcategories(isPressureSwitches || isValves || isFlowSwitches || isPressureTransmitters || isFilterDriers || isPressureGauge || isTeflonTape || isAxeonPumps || isVibrationEliminators || isBrazingRod || isRelay || isScrollCompressors)
    if (isPressureSwitches) {
      setSubcategoryType('pressure-switches')
    } else if (isValves) {
      setSubcategoryType('valves')
    } else if (isFlowSwitches) {
      setSubcategoryType('flow-switches')
    } else if (isPressureTransmitters) {
      setSubcategoryType('pressure-transmitters')
    } else if (isFilterDriers) {
      setSubcategoryType('filter-driers')
    } else if (isPressureGauge) {
      setSubcategoryType('pressure-gauge')
    } else if (isTeflonTape) {
      setSubcategoryType('teflon-tape')
    } else if (isAxeonPumps) {
      setSubcategoryType('axeon-pumps')
    } else if (isVibrationEliminators) {
      setSubcategoryType('vibration-eliminators')
    } else if (isBrazingRod) {
      setSubcategoryType('brazing-rod')
    } else if (isRelay) {
      setSubcategoryType('relay')
    } else if (isScrollCompressors) {
      setSubcategoryType('scroll-compressors')
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
      if (flowSwitchSubcategories.find(s => s.id === subcategoryId)) return 'flow-switches'
      if (pressureTransmitterSubcategories.find(s => s.id === subcategoryId)) return 'pressure-transmitters'
      if (filterDrierSubcategories.find(s => s.id === subcategoryId)) return 'filter-driers'
      if (pressureGaugeSubcategories.find(s => s.id === subcategoryId)) return 'pressure-gauge'
      if (teflonTapeSubcategories.find(s => s.id === subcategoryId)) return 'teflon-tape'
      if (axeonPumpsSubcategories.find(s => s.id === subcategoryId)) return 'axeon-pumps'
      if (vibrationEliminatorsSubcategories.find(s => s.id === subcategoryId)) return 'vibration-eliminators'
      if (brazingRodSubcategories.find(s => s.id === subcategoryId)) return 'brazing-rod'
      if (relaySubcategories.find(s => s.id === subcategoryId)) return 'relay'
      return subcategoryType
    })()
    
    if (type === 'pressure-switches') {
      setLocation(`/pressure-switches/${subcategoryId}`)
    } else if (type === 'valves') {
      setLocation(`/valves/${subcategoryId}`)
    } else if (type === 'flow-switches') {
      setLocation(`/flow-switches/${subcategoryId}`)
    } else if (type === 'pressure-transmitters') {
      setLocation(`/pressure-transmitters/${subcategoryId}`)
    } else if (type === 'filter-driers') {
      setLocation(`/filter-driers/${subcategoryId}`)
    } else if (type === 'pressure-gauge') {
      setLocation(`/pressure-gauge/${subcategoryId}`)
    } else if (type === 'teflon-tape') {
      setLocation(`/teflon-tape/${subcategoryId}`)
    } else if (type === 'axeon-pumps') {
      setLocation(`/axeon-pumps/${subcategoryId}`)
    } else if (type === 'vibration-eliminators') {
      setLocation(`/vibration-eliminators/${subcategoryId}`)
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
    } else if (subcategoryType === 'teflon-tape') {
      setLocation(`/teflon-tape/${subcategoryId}`)
    } else if (subcategoryType === 'axeon-pumps') {
      setLocation(`/axeon-pumps/${subcategoryId}`)
    } else if (subcategoryType === 'vibration-eliminators') {
      setLocation(`/vibration-eliminators/${subcategoryId}`)
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
      <div ref={heroRef} className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <NavigationBreadcrumb className="mb-8" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              HVAC & Refrigeration <span className="text-blue-600">Products</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              Professional equipment for contractors, technicians, and engineers. Browse our extensive catalog of premium components.
            </p>
            
            {/* Search Bar Removed */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-12 relative z-10">
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
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {subcategoryType === 'pressure-switches' ? 'Pressure Switch Categories' :
                       subcategoryType === 'valves' ? 'Valve Categories' :
                       subcategoryType === 'flow-switches' ? 'Flow Switch Categories' :
                       subcategoryType === 'pressure-transmitters' ? 'Pressure Transmitter Categories' : 
                       subcategoryType === 'filter-driers' ? 'Filter Driers/Filter Drier Shell Categories' : 
                       subcategoryType === 'pressure-gauge' ? 'Pressure Gauge/Manifold Gauge Categories' : 
                       subcategoryType === 'teflon-tape' ? 'Teflon Tape Categories' : 
                       subcategoryType === 'axeon-pumps' ? 'Axeon Pumps Categories' : 
                       subcategoryType === 'vibration-eliminators' ? 'Vibration Eliminators Categories' : 
                       subcategoryType === 'scroll-compressors' ? 'Scroll Compressors' : 'Categories'}
                    </h2>
                    <p className="text-slate-500 mt-2 text-lg">Select a category to view products</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 text-slate-700"
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

                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
                  {(subcategoryType === 'pressure-switches' ? subcategories :
                    subcategoryType === 'valves' ? valveSubcategories :
                    subcategoryType === 'flow-switches' ? flowSwitchSubcategories :
                    subcategoryType === 'pressure-transmitters' ? pressureTransmitterSubcategories : 
                    subcategoryType === 'filter-driers' ? filterDrierSubcategories : 
                    subcategoryType === 'pressure-gauge' ? pressureGaugeSubcategories : 
                    subcategoryType === 'teflon-tape' ? teflonTapeSubcategories : 
                    subcategoryType === 'axeon-pumps' ? axeonPumpsSubcategories : 
                    subcategoryType === 'vibration-eliminators' ? vibrationEliminatorsSubcategories : 
                    subcategoryType === 'brazing-rod' ? brazingRodSubcategories : 
                    subcategoryType === 'relay' ? relaySubcategories : 
                    subcategoryType === 'scroll-compressors' ? [scrollCompressorCategory] : []).map((subcategory) => {
                    const categoryName = subcategoryType === 'pressure-switches' ? 'Pressure Switches' :
                                       subcategoryType === 'valves' ? 'Valves' :
                                       subcategoryType === 'flow-switches' ? 'Flow Switches' :
                                       subcategoryType === 'pressure-transmitters' ? 'Pressure Transmitters' : 
                                       subcategoryType === 'filter-driers' ? 'Filter Driers/Filter Drier Shell' : 
                                       subcategoryType === 'pressure-gauge' ? 'Pressure Gauge/Manifold Gauge' : 
                                       subcategoryType === 'teflon-tape' ? 'Teflon Tape' : 
                                       subcategoryType === 'axeon-pumps' ? 'Axeon Pumps' : 
                                       subcategoryType === 'vibration-eliminators' ? 'Vibration Eliminators' : 
                                       subcategoryType === 'brazing-rod' ? 'Brazing Rod' : 
                                       subcategoryType === 'relay' ? 'Relay' : 
                                       subcategoryType === 'scroll-compressors' ? 'Scroll Compressors' : 'Products'
                    const linkPath = subcategoryType === 'pressure-switches'
                      ? `/pressure-switches/${subcategory.id}`
                      : subcategoryType === 'valves'
                      ? `/valves/${subcategory.id}`
                      : subcategoryType === 'flow-switches'
                      ? `/flow-switches/${subcategory.id}`
                      : subcategoryType === 'pressure-transmitters'
                      ? `/pressure-transmitters/${subcategory.id}`
                      : subcategoryType === 'filter-driers'
                      ? `/filter-driers/${subcategory.id}`
                      : subcategoryType === 'pressure-gauge'
                      ? `/pressure-gauge/${subcategory.id}`
                      : subcategoryType === 'teflon-tape'
                      ? `/teflon-tape/${subcategory.id}`
                      : subcategoryType === 'axeon-pumps'
                      ? `/axeon-pumps/${subcategory.id}`
                      : subcategoryType === 'vibration-eliminators'
                      ? `/vibration-eliminators/${subcategory.id}`
                      : subcategoryType === 'brazing-rod'
                      ? `/brazing-rod/${subcategory.id}`
                      : subcategoryType === 'relay'
                      ? `/relay/${subcategory.id}`
                      : subcategoryType === 'scroll-compressors'
                      ? `/scroll-compressors`
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
                <div className="space-y-8">
                  <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
                    <p className="text-slate-500 mt-2 text-lg">Select a category to view products</p>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
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

                    {/* Teflon Tape Categories */}
                    {teflonTapeSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`teflon-tape-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Teflon Tape"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/teflon-tape/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'teflon-tape')}
                      />
                    ))}

                    {/* Axeon Pumps Categories */}
                    {axeonPumpsSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`axeon-pumps-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Axeon Pumps"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/axeon-pumps/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'axeon-pumps')}
                      />
                    ))}

                    {/* Vibration Eliminators Categories */}
                    {vibrationEliminatorsSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`vibration-eliminators-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Vibration Eliminators"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          connection: subcategory.connection,
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/vibration-eliminators/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'vibration-eliminators')}
                      />
                    ))}

                    {brazingRodSubcategories.map((subcategory) => (
                      <ProductCard
                        key={`brazing-rod-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Brazing Rod"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/brazing-rod/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'brazing-rod')}
                      />
                    ))}

                    {relaySubcategories.map((subcategory) => (
                      <ProductCard
                        key={`relay-${subcategory.id}`}
                        id={subcategory.id}
                        title={subcategory.name}
                        modelNumber={subcategory.modelNumber}
                        image={subcategory.image}
                        price={0}
                        category="Relay"
                        series={subcategory.modelNumber}
                        stockStatus="in_stock"
                        rating={4.7}
                        reviewCount={subcategory.productCount}
                        specifications={{
                          pressure: `${subcategory.productCount} models available`
                        }}
                        customLink={`/relay/${subcategory.id}`}
                        onClick={() => handleSubcategoryClick(subcategory.id, 'relay')}
                      />
                    ))}

                    {/* Scroll Compressors Category */}
                    <ProductCard
                      key="scroll-compressors"
                      id={scrollCompressorCategory.id}
                      title={scrollCompressorCategory.name}
                      modelNumber={scrollCompressorCategory.modelNumber}
                      image={scrollCompressorCategory.image}
                      price={0}
                      category="Scroll Compressors"
                      series={scrollCompressorCategory.modelNumber}
                      stockStatus="in_stock"
                      rating={4.7}
                      reviewCount={scrollCompressorCategory.productCount}
                      specifications={{
                        pressure: `${scrollCompressorCategory.productCount} models available`
                      }}
                      customLink="/scroll-compressors"
                      onClick={() => setLocation('/scroll-compressors')}
                    />
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
          <div className="lg:hidden fixed bottom-8 right-8 z-50">
            <Button
              onClick={() => setFilterSidebarOpen(true)}
              className="rounded-full shadow-2xl h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold tracking-wide active:scale-95 transition-all duration-300"
              data-testid="button-mobile-filter"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}