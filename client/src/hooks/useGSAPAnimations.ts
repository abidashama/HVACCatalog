import { useEffect, useRef, RefObject } from 'react'
import gsap from 'gsap'

// Hook for fade in animations on component mount
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(duration: number = 0.6, delay: number = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const tween = gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration,
        delay,
        ease: 'power2.out'
      }
    )

    return () => {
      tween.kill()
    }
  }, [duration, delay])

  return ref
}

// Hook for staggered animations for lists/grids
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(staggerDelay: number = 0.1, duration: number = 0.5) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const children = container.children
    
    const tween = gsap.fromTo(
      children,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        stagger: staggerDelay,
        ease: 'power2.out'
      }
    )

    return () => {
      tween.kill()
    }
  }, [staggerDelay, duration])

  return containerRef
}

// Hook for professional hover animations
export function useHoverAnimation<T extends HTMLElement = HTMLDivElement>(ref: RefObject<T>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => {
      gsap.to(element, {
        y: -4,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref])
}

// Hook for slide in animations from different directions
export function useSlideIn<T extends HTMLElement = HTMLDivElement>(direction: 'left' | 'right' | 'up' | 'down' = 'up', duration: number = 0.6) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const fromProps: any = { opacity: 0 }
    const toProps: any = { opacity: 1, duration, ease: 'power2.out' }

    switch (direction) {
      case 'left':
        fromProps.x = -50
        toProps.x = 0
        break
      case 'right':
        fromProps.x = 50
        toProps.x = 0
        break
      case 'up':
        fromProps.y = 50
        toProps.y = 0
        break
      case 'down':
        fromProps.y = -50
        toProps.y = 0
        break
    }

    const tween = gsap.fromTo(element, fromProps, toProps)

    return () => {
      tween.kill()
    }
  }, [direction, duration])

  return ref
}

// Hook for loading animations
export function useLoadingAnimation<T extends HTMLElement = HTMLDivElement>(isLoading: boolean, ref: RefObject<T>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const tween = isLoading
      ? gsap.to(element, {
          opacity: 0.6,
          scale: 0.98,
          duration: 0.3,
          ease: 'power2.out'
        })
      : gsap.to(element, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

    return () => {
      tween.kill()
    }
  }, [isLoading, ref])
}

// Hook for counter/number animations
export function useCountAnimation<T extends HTMLElement = HTMLSpanElement>(
  targetValue: number,
  duration: number = 2,
  ref: RefObject<T>
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const obj = { value: 0 }

    const tween = gsap.to(obj, {
      value: targetValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toLocaleString()
      }
    })

    return () => {
      tween.kill()
    }
  }, [targetValue, duration, ref])
}

// Hook for revealing text animations
export function useTextReveal<T extends HTMLElement = HTMLDivElement>(ref: RefObject<T>, delay: number = 0) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const tween = gsap.fromTo(
      element,
      {
        y: '100%',
        opacity: 0
      },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power2.out'
      }
    )

    return () => {
      tween.kill()
    }
  }, [ref, delay])
}