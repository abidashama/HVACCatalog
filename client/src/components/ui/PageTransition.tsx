import { useEffect, useRef, ReactNode } from 'react'
import gsap from 'gsap'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    // Page enter animation
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }
    )

    // Cleanup function for page exit
    return () => {
      gsap.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }, [])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}