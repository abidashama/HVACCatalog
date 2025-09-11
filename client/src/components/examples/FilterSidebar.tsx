import { useState } from 'react'
import FilterSidebar from '../filters/FilterSidebar'
import { Button } from '@/components/ui/button'

export default function FilterSidebarExample() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="h-screen flex">
      <FilterSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex-1 p-4">
        <Button onClick={() => setIsOpen(true)}>
          Open Filter Sidebar
        </Button>
      </div>
    </div>
  )
}