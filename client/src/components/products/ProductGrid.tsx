import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Grid, List, Filter, SortDesc, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from './ProductCard'
import type { SelectProduct, ProductFilters } from '@shared/schema'
import { gsap } from 'gsap'
import pressureSwitchData from '@/assets/data/pressure-switch.json'
import filterDrierData from '@/assets/data/filter_driers_filter_drier_shell.json'
import pressureGaugeData from '@/assets/data/pressure_gauge_manifold_gauge.json'
import teflonTapeData from '@/assets/data/teflon_tape.json'
import axeonPumpsData from '@/assets/data/axeon_pumps.json'
import vibrationEliminatorsData from '@/assets/data/vibration_eliminators.json'
import brazingRodData from '@/assets/data/brazing_rod.json'
import relayData from '@/assets/data/relay.json'


type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest' | 'rating'

interface ProductGridProps {
  filters?: Partial<ProductFilters>
  searchQuery?: string
  onFiltersChange?: (filters: Partial<ProductFilters>) => void
  onSearchChange?: (search: string) => void
}

export default function ProductGrid({ filters, searchQuery, onFiltersChange, onSearchChange }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  
  // Refs for GSAP animations
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Build query parameters for API
  const queryParams = useMemo(() => {
    const params: ProductFilters = {
      page: 1,
      limit: 1000, // High limit to get all products without pagination
      sortBy,
      ...filters
    }
    
    if (searchQuery?.trim()) {
      params.search = searchQuery.trim()
    }
    
    return params
  }, [sortBy, filters, searchQuery])
  
  // Fetch products from API
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/products', queryParams],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString())
        }
      })
      
      const response = await fetch(`/api/products?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000    // 10 minutes
  })
  
  const apiProducts = productsResponse?.products || []
  const totalProducts = productsResponse?.total || 0

  // Build local products from pressure-switch.json when category is Pressure Switches
  const pressureSwitchProducts = useMemo(() => {
    const baseImage = '/assets/generated_images/Pressure_switch_product_photo_6632abba.png'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (pressureSwitchData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Pressure Switches',
        series: p.series ?? 'LF55 Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      } as SelectProduct)
    }

    const seriesFromModel = (model: string): string => {
      const upper = model.replace(/\s+/g, '').toUpperCase()
      if (upper.startsWith('LF08')) return 'LF08 Series'
      if (upper.startsWith('LF5D')) return 'LF5D Series'
      if (upper.startsWith('LF58')) return 'LF58 Series'
      if (upper.startsWith('LF32')) return 'LF32 Series'
      if (upper.startsWith('LF55') || upper.startsWith('LF55')) return 'LF55 Series'
      return 'LF55 Series'
    }

    const priceFor = (model: string) => {
      const hash = Array.from(model).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
      const base = 70 + (hash % 60)
      return base.toFixed(2)
    }

    // Waterline
    const water = categories.pressureSwitches
    if (water?.products) {
      for (const item of water.products as Array<{model: string, range: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${water.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, connection: water.connection, certification: (water.certifications||[]).join(', ') })
        })
      }
    }

    // LP & HP refrigeration
    const lpHp = categories.lpHpRefrigerationSwitches
    if (lpHp?.products) {
      for (const item of lpHp.products as Array<{model: string, range: string, resetOption?: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${lpHp.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, resetOption: item.resetOption, connection: lpHp.connection, certification: (lpHp.certifications||[]).join(', ') })
        })
      }
    }

    // Combined
    const combined = categories.lpHpCombinedSwitches
    if (combined?.products) {
      for (const item of combined.products as Array<{model: string, range: string, resetOption?: {LP: string, HP: string}}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${combined.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, resetOption: item.resetOption ? JSON.stringify(item.resetOption) : undefined, connection: combined.connection, certification: (combined.certifications||[]).join(', ') })
        })
      }
    }

    // Small fix differential (LF08)
    const smallFix = categories.smallFixDifferentialSwitches
    if (smallFix) {
      const model = (smallFix.model as string) ?? 'LF08'
      const ranges: string[] = [
        ...(smallFix.highPressureRanges?.map((r: any) => r.range) || []),
        ...(smallFix.lowPressureRanges?.map((r: any) => r.range) || [])
      ]
      add({
        id: `${model.toLowerCase()}-cartridge`.replace(/[^a-z0-9]+/g, '-'),
        title: `${smallFix.name} - ${model}`,
        modelNumber: model,
        image: baseImage,
        price: priceFor(model),
        series: seriesFromModel(model),
        specifications: JSON.stringify({ pressure: ranges.join(' | '), connection: smallFix.connection, certification: (smallFix.certifications||[]).join(', '), refrigerants: smallFix.refrigerants })
      })
    }

    // Oil differential (LF5D)
    const oil = categories.oilDifferentialSwitches
    if (oil?.products) {
      for (const item of oil.products as Array<{model: string, range: string, maxOperatingPressureBar?: number}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${oil.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: item.range, maxOperatingPressureBar: item.maxOperatingPressureBar, connection: oil.connection, certification: (oil.certifications||[]).join(', ') })
        })
      }
    }

    // Air differential (LF32)
    const air = categories.airDifferentialSwitches
    if (air?.products) {
      for (const item of air.products as Array<{model: string, range: string | string[]}>) {
        const model = item.model as string
        const range = Array.isArray(item.range) ? item.range.join(' | ') : item.range
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${air.name} - ${model}`,
          modelNumber: model,
          image: baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ pressure: range, certification: (air.certifications||[]).join(', ') })
        })
      }
    }

    return out
  }, [])

  // Build local products from filter_driers_filter_drier_shell.json when category is Filter Driers
  const filterDrierProducts = useMemo(() => {
    const baseImage = '/assets/images/filter_driers/filter_drier.webp'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (filterDrierData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Filter Driers/Filter Drier Shell',
        series: p.series ?? 'SEK Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('SEK-032') || model.includes('SEK-033')) return '45.00'
      if (model.includes('SEK-053') || model.includes('SEK-083')) return '55.00'
      if (model.includes('SEK-163') || model.includes('SEK-164')) return '65.00'
      if (model.includes('SEK-165')) return '70.00'
      if (model.includes('SEK-304') || model.includes('SEK-305')) return '80.00'
      if (model.includes('SPL-487') || model.includes('SPL-489')) return '120.00'
      if (model.includes('SPL-4811')) return '140.00'
      if (model.includes('SPL-967') || model.includes('SPL-969')) return '180.00'
      if (model.includes('SPL-9611')) return '200.00'
      return '99.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.startsWith('SEK')) return 'SEK Series'
      if (model.startsWith('SPL')) return 'SPL Series'
      return 'Standard Series'
    }

    // Filter Driers (SEK Series)
    const filterDriers = categories.filterDriers
    if (filterDriers?.products) {
      for (const item of filterDriers.products as Array<{model: string, connection: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${filterDriers.name} - ${model}`,
          modelNumber: model,
          image: filterDriers.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ 
            connection: item.connection,
            note: filterDriers.note
          })
        })
      }
    }

    // Filter Drier Shell (SPL Series)
    const filterDrierShell = categories.filterDrierShell
    if (filterDrierShell?.products) {
      for (const item of filterDrierShell.products as Array<{model: string, connection: string, height?: string, core?: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${filterDrierShell.name} - ${model}`,
          modelNumber: model,
          image: filterDrierShell.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ 
            connection: item.connection,
            height: item.height,
            core: item.core
          })
        })
      }
    }

    return out
  }, [])

  // Build local products from pressure_gauge_manifold_gauge.json when category is Pressure Gauge/Manifold Gauge
  const pressureGaugeProducts = useMemo(() => {
    const baseImage = '/assets/images/pressure_gauge/pressure_gauge.webp'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (pressureGaugeData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Pressure Gauge/Manifold Gauge',
        series: p.series ?? 'Gauge Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('LOW PRESSURE')) return '35.00'
      if (model.includes('HIGH PRESSURE') && model.includes('R410A')) return '55.00'
      if (model.includes('HIGH PRESSURE')) return '45.00'
      if (model.includes('CT-466L')) return '120.00'
      if (model.includes('CT-466H')) return '140.00'
      return '99.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.includes('CT-466')) return 'CT Series'
      return 'Pressure Gauge Series'
    }

    // Pressure Gauges
    const pressureGauges = categories.pressureGauges
    if (pressureGauges?.products) {
      for (const item of pressureGauges.products as Array<{model: string, range: string, connection: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${pressureGauges.name} - ${model}`,
          modelNumber: model,
          image: pressureGauges.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ 
            range: item.range,
            connection: item.connection
          })
        })
      }
    }

    // Manifold Gauges
    const manifoldGauges = categories.manifoldGauges
    if (manifoldGauges?.products) {
      for (const item of manifoldGauges.products as Array<{model: string, range: string, connection: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${manifoldGauges.name} - ${model}`,
          modelNumber: model,
          image: manifoldGauges.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ 
            range: item.range,
            connection: item.connection
          })
        })
      }
    }

    return out
  }, [])

  // Build local products from teflon_tape.json when category is Teflon Tape
  const teflonTapeProducts = useMemo(() => {
    const baseImage = '/assets/images/teflon_tape.png'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (teflonTapeData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Teflon Tape',
        series: p.series ?? 'Teflon Tape Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('PREMIUM')) return '8.00'
      if (model.includes('AXEON') && model.includes('15')) return '6.00'
      if (model.includes('AXEON') && model.includes('10')) return '5.00'
      if (model.includes('CHAMPIONS') && model.includes('15')) return '4.50'
      if (model.includes('CHAMPIONS') && model.includes('10')) return '3.50'
      return '5.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.includes('AXEON PREMIUM')) return 'Axeon Premium Series'
      if (model.includes('AXEON')) return 'Axeon Series'
      if (model.includes('CHAMPIONS')) return 'Champions Series'
      return 'Teflon Tape Series'
    }

    // Teflon Tape
    const teflonTape = categories.teflonTape
    if (teflonTape?.products) {
      for (const item of teflonTape.products as Array<{model: string, weight: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${teflonTape.name} - ${model}`,
          modelNumber: model,
          image: teflonTape.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ 
            weight: item.weight
          })
        })
      }
    }

    return out
  }, [])

  // Build local products from axeon_pumps.json when category is Axeon Pumps
  const axeonPumpsProducts = useMemo(() => {
    const baseImage = '/assets/images/axeon_pumps/self_priming_pump.png'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (axeonPumpsData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Axeon Pumps',
        series: p.series ?? 'Pump Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('1.5 HP')) return '15000.00'
      if (model.includes('1HP') || model.includes('1 HP')) return '12000.00'
      if (model.includes('0.5 HP')) return '10000.00'
      if (model.includes('4-4')) return '18000.00'
      if (model.includes('2-6')) return '14000.00'
      if (model.includes('2-3')) return '12000.00'
      return '10000.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.includes('JETS')) return 'JETS Series'
      if (model.includes('SP') || model.includes('TP')) return 'Multistage Series'
      return 'Pump Series'
    }

    // Self Priming Pump SS
    const selfPrimingPump = categories.selfPrimingPumpSS
    if (selfPrimingPump?.subcategories) {
      Object.values(selfPrimingPump.subcategories).forEach((subcategory: any) => {
        if (subcategory.products) {
          for (const item of subcategory.products as Array<{model: string, power?: string, phase?: string, voltage?: string}>) {
            const model = item.model as string
            add({
              id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: `${selfPrimingPump.name} - ${model}`,
              modelNumber: model,
              image: selfPrimingPump.image || baseImage,
              price: priceFor(model),
              series: seriesFromModel(model),
              specifications: JSON.stringify({ 
                power: item.power,
                phase: item.phase,
                voltage: item.voltage
              })
            })
          }
        }
      })
    }

    // Multistage Pump
    const multistagePump = categories.multistagePump
    if (multistagePump?.products) {
      for (const item of multistagePump.products as Array<{model: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${multistagePump.name} - ${model}`,
          modelNumber: model,
          image: multistagePump.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({})
        })
      }
    }

    return out
  }, [])

  // Build local products from vibration_eliminators.json when category is Vibration Eliminators
  const vibrationEliminatorsProducts = useMemo(() => {
    const baseImage = '/assets/images/vibration_eliminators.png'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (vibrationEliminatorsData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Vibration Eliminators',
        series: p.series ?? 'SVA Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('SVA-9') || model.includes('SVA-8')) return '450.00'
      if (model.includes('SVA-7') || model.includes('SVA-6')) return '380.00'
      if (model.includes('SVA-5')) return '320.00'
      if (model.includes('SVA-3') || model.includes('SVA-2')) return '250.00'
      if (model.includes('SVA-1')) return '200.00'
      return '250.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.startsWith('SVA')) return 'SVA Series'
      return 'Vibration Eliminator Series'
    }

    // Vibration Eliminators
    const vibrationEliminators = categories.vibrationEliminators
    if (vibrationEliminators?.products) {
      for (const item of vibrationEliminators.products as Array<{model: string, connection: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${vibrationEliminators.name} - ${model}`,
          modelNumber: model,
          image: vibrationEliminators.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({ 
            connection: item.connection
          })
        })
      }
    }

    return out
  }, [])

  // Build local products from brazing_rod.json when category is Brazing Rod
  const brazingRodProducts = useMemo(() => {
    const baseImage = '/assets/images/brazing_rod/brazing_rod.webp'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (brazingRodData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Brazing Rod',
        series: p.series ?? 'AXEON Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('BCUP-2')) return '150.00'
      return '150.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.startsWith('AXEON')) return 'AXEON Series'
      return 'Brazing Rod Series'
    }

    // Brazing Rod
    const brazingRod = categories.brazingRod
    if (brazingRod?.products) {
      for (const item of brazingRod.products as Array<{model: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${brazingRod.name} - ${model}`,
          modelNumber: model,
          image: brazingRod.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({})
        })
      }
    }

    return out
  }, [])

  // Build local products from relay.json when category is Relay
  const relayProducts = useMemo(() => {
    const baseImage = '/assets/images/relay/relay.webp'
    const out: Array<SelectProduct> = [] as any
    const categories: any = (relayData as any)?.categories || {}

    const add = (p: Partial<SelectProduct> & { id: string }) => {
      out.push({
        id: p.id,
        title: p.title ?? '',
        modelNumber: p.modelNumber ?? '',
        image: p.image ?? baseImage,
        price: p.price ?? '99.00',
        originalPrice: (p as any).originalPrice ?? null,
        category: 'Relay',
        series: p.series ?? 'GR Series',
        stockStatus: p.stockStatus ?? 'in_stock',
        rating: p.rating ?? '4.7',
        reviewCount: p.reviewCount ?? 10,
        specifications: p.specifications ?? null,
        description: p.description ?? null,
        tags: p.tags ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const priceFor = (model: string): string => {
      // Simple pricing logic based on model
      if (model.includes('GR3800')) return '180.00'
      return '180.00'
    }

    const seriesFromModel = (model: string): string => {
      if (model.startsWith('GR')) return 'GR Series'
      return 'Relay Series'
    }

    // Relay
    const relay = categories.relay
    if (relay?.products) {
      for (const item of relay.products as Array<{model: string}>) {
        const model = item.model as string
        add({
          id: model.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: `${relay.name} - ${model}`,
          modelNumber: model,
          image: relay.image || baseImage,
          price: priceFor(model),
          series: seriesFromModel(model),
          specifications: JSON.stringify({})
        })
      }
    }

    return out
  }, [])

  const isPressureSwitchCategory = (filters?.category || '').toLowerCase() === 'pressure switches'.toLowerCase()
  const isFilterDrierCategory = (filters?.category || '').toLowerCase() === 'filter driers/filter drier shell'.toLowerCase()
  const isPressureGaugeCategory = (filters?.category || '').toLowerCase() === 'pressure gauge/manifold gauge'.toLowerCase()
  const isTeflonTapeCategory = (filters?.category || '').toLowerCase() === 'teflon tape'.toLowerCase()
  const isAxeonPumpsCategory = (filters?.category || '').toLowerCase() === 'axeon pumps'.toLowerCase()
  const isVibrationEliminatorsCategory = (filters?.category || '').toLowerCase() === 'vibration eliminators'.toLowerCase()
  const isBrazingRodCategory = (filters?.category || '').toLowerCase() === 'brazing rod'.toLowerCase()
  const isRelayCategory = (filters?.category || '').toLowerCase() === 'relay'.toLowerCase()

  const products = isPressureSwitchCategory ? pressureSwitchProducts : 
                  isFilterDrierCategory ? filterDrierProducts : 
                  isPressureGaugeCategory ? pressureGaugeProducts :
                  isTeflonTapeCategory ? teflonTapeProducts :
                  isAxeonPumpsCategory ? axeonPumpsProducts :
                  isVibrationEliminatorsCategory ? vibrationEliminatorsProducts :
                  isBrazingRodCategory ? brazingRodProducts :
                  isRelayCategory ? relayProducts :
                  apiProducts
  const displayTotal = isPressureSwitchCategory ? pressureSwitchProducts.length : 
                       isFilterDrierCategory ? filterDrierProducts.length :
                       isPressureGaugeCategory ? pressureGaugeProducts.length :
                       isTeflonTapeCategory ? teflonTapeProducts.length :
                       isAxeonPumpsCategory ? axeonPumpsProducts.length :
                       isVibrationEliminatorsCategory ? vibrationEliminatorsProducts.length :
                       isBrazingRodCategory ? brazingRodProducts.length :
                       isRelayCategory ? relayProducts.length :
                       totalProducts
  
  // Convert API product data to component props format
  const transformProduct = (product: SelectProduct) => {
    let specifications = {}
    try {
      specifications = product.specifications 
        ? JSON.parse(product.specifications) 
        : {}
    } catch (error) {
      console.warn('Failed to parse product specifications:', error)
      specifications = {}
    }
    
    return {
      id: product.id,
      title: product.title,
      modelNumber: product.modelNumber,
      image: product.image,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
      category: product.category,
      series: product.series,
      stockStatus: product.stockStatus,
      rating: parseFloat(product.rating),
      reviewCount: product.reviewCount,
      specifications
    }
  }

  const handleSort = (value: SortOption) => {
    setSortBy(value)
  }

  // GSAP Stagger Animation for product cards
  useEffect(() => {
    if (!isLoading && products.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('[data-testid^="product-card-"]')
      
      // Only animate if we have cards
      if (cards.length > 0) {
        // Set initial state immediately
        gsap.set(cards, { 
          opacity: 0, 
          y: 30,
          scale: 0.9
        })
        
        // Then animate to visible state with stagger
        gsap.to(cards, {
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08, // 80ms delay between each card
          ease: "power2.out",
          delay: 0.1 // Small delay to ensure DOM is ready
        })
      }
    }
  }, [isLoading, products.length])

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground" data-testid="text-product-count">
            {isLoading ? 'Loading products...' : `Showing ${displayTotal} ${displayTotal === 1 ? 'product' : 'products'}`}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-48" data-testid="select-sort">
              <SortDesc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              data-testid="button-view-grid"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters?.category || filters?.series || filters?.search || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters?.category && (
            <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
              Category: {filters.category} ✕
            </Badge>
          )}
          {filters?.series && (
            <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
              Series: {filters.series} ✕
            </Badge>
          )}
          {(filters?.search || searchQuery) && (
            <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
              Search: {filters?.search || searchQuery} ✕
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary" 
            onClick={() => {
              onFiltersChange?.({})
              onSearchChange?.('')
            }}
            data-testid="button-clear-all-filters-grid"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert className="mb-6" data-testid="alert-products-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. 
            <Button variant="ghost" onClick={() => refetch()} className="ml-2 p-0 h-auto" data-testid="button-retry-products">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (!isLoading && products.length === 0) ? (
        <div className="text-center py-12" data-testid="message-no-products">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6'
            : 'space-y-4'
        } data-testid="container-products" ref={gridRef}>
          {products.map((product: SelectProduct) => {
            const transformed = transformProduct(product)
            // Heat exchangers, Axeon Valves, Accumulator, and Fan products should use their category-specific detail pages
            let customLink: string | undefined
            if (product.category === 'Heat Exchangers') {
              customLink = '/heat-exchangers/bphe'
            } else if (product.category === 'Axeon Valves') {
              // Use the specific product ID for dynamic routing
              customLink = `/axeon-valves/${product.id}`
            } else if (product.category === 'Accumulator/Oil Separator/Liquid Receiver') {
              // Use the specific product ID for dynamic routing
              customLink = `/accumulator/${product.id}`
            } else if (product.category === 'Axial Fans/Shaded Pole Motor/Small Fans') {
              // Use the specific product ID for dynamic routing
              customLink = `/fans/${product.id}`
            }
            return (
              <ProductCard
                key={product.id}
                {...transformed}
                customLink={customLink}
                isCompact={viewMode === 'list'}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}