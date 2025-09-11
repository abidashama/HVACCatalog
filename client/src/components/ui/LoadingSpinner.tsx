import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary' 
}: LoadingSpinnerProps) {
  const spinnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = spinnerRef.current
    if (!element) return

    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1
    })
  }, [])

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white'
  }

  return (
    <div 
      ref={spinnerRef}
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        border-2 border-t-transparent rounded-full
      `}
      aria-label="Loading"
    />
  )
}