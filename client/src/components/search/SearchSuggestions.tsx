import { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'

interface SearchSuggestion {
  id: string
  type: 'product' | 'category' | 'brand' | 'model'
  title: string
  subtitle?: string
  category?: string
  popularity?: number
  recentSearch?: boolean
}

interface SearchSuggestionsProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  className?: string
}

// Mock suggestions data - in real app this would come from API
const mockSuggestions: SearchSuggestion[] = [
  // Recent searches
  { id: 'recent-1', type: 'product', title: 'LF55 Pressure Switch', subtitle: 'Automatic Reset', recentSearch: true, popularity: 95 },
  { id: 'recent-2', type: 'category', title: 'Heat Exchangers', subtitle: 'Plate Type', recentSearch: true, popularity: 88 },
  
  // Popular products
  { id: 'pop-1', type: 'product', title: 'Lefoo LF5532 Pressure Switch', subtitle: 'Auto Reset, 24V', category: 'Pressure Switches', popularity: 98 },
  { id: 'pop-2', type: 'product', title: 'Axeon Plate Heat Exchanger', subtitle: '20 Plates, Stainless Steel', category: 'Heat Exchangers', popularity: 92 },
  { id: 'pop-3', type: 'product', title: 'Scroll Compressor 5HP', subtitle: 'R410A Refrigerant', category: 'Compressors', popularity: 85 },
  
  // Categories
  { id: 'cat-1', type: 'category', title: 'Pressure Switches', subtitle: '24 products', popularity: 90 },
  { id: 'cat-2', type: 'category', title: 'Heat Exchangers', subtitle: '18 products', popularity: 87 },
  { id: 'cat-3', type: 'category', title: 'Refrigeration Components', subtitle: '32 products', popularity: 83 },
  
  // Brands
  { id: 'brand-1', type: 'brand', title: 'Lefoo', subtitle: 'Pressure switches & controls', popularity: 94 },
  { id: 'brand-2', type: 'brand', title: 'Axeon', subtitle: 'Heat exchangers & pumps', popularity: 89 },
  
  // Model numbers
  { id: 'model-1', type: 'model', title: 'LF5532', subtitle: 'Auto reset pressure switch', category: 'Pressure Switches', popularity: 96 },
  { id: 'model-2', type: 'model', title: 'PHE-20', subtitle: 'Plate heat exchanger', category: 'Heat Exchangers', popularity: 91 }
]

const typeIcons = {
  product: Search,
  category: Filter,
  brand: TrendingUp,
  model: Search
}

const typeLabels = {
  product: 'Product',
  category: 'Category',
  brand: 'Brand',
  model: 'Model'
}

export default function SearchSuggestions({ 
  placeholder = "Search products, categories, models...", 
  onSearch, 
  onSuggestionSelect,
  className 
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hvac-recent-searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent searches and popular items when no query
      const recentItems = mockSuggestions.filter(s => s.recentSearch || s.popularity && s.popularity > 90)
      setSuggestions(recentItems.slice(0, 8))
    } else {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        (suggestion.subtitle && suggestion.subtitle.toLowerCase().includes(query.toLowerCase())) ||
        (suggestion.category && suggestion.category.toLowerCase().includes(query.toLowerCase()))
      )
      setSuggestions(filtered.slice(0, 10))
    }
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    // Add to recent searches
    const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updatedRecent)
    localStorage.setItem('hvac-recent-searches', JSON.stringify(updatedRecent))
    
    setIsOpen(false)
    setQuery('')
    
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.title)
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const key = suggestion.recentSearch ? 'recent' : suggestion.type
    if (!groups[key]) groups[key] = []
    groups[key].push(suggestion)
    return groups
  }, {} as Record<string, SearchSuggestion[]>)

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
          data-testid="search-input"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-96 overflow-hidden">
          <Command className="w-full">
            <CommandList>
              {suggestions.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm">
                  {query ? 'No results found.' : 'Start typing to search...'}
                </CommandEmpty>
              ) : (
                Object.entries(groupedSuggestions).map(([groupKey, groupSuggestions]) => (
                  <CommandGroup 
                    key={groupKey} 
                    heading={
                      groupKey === 'recent' ? 'Recent Searches' : 
                      groupKey === 'product' ? 'Products' :
                      groupKey === 'category' ? 'Categories' :
                      groupKey === 'brand' ? 'Brands' : 'Models'
                    }
                  >
                    {groupSuggestions.map((suggestion) => {
                      const IconComponent = typeIcons[suggestion.type]
                      return (
                        <CommandItem
                          key={suggestion.id}
                          onSelect={() => handleSuggestionClick(suggestion)}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover-elevate"
                          data-testid={`suggestion-${suggestion.id}`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              {suggestion.recentSearch ? (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <IconComponent className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground truncate">
                                  {suggestion.title}
                                </span>
                                {suggestion.popularity && suggestion.popularity > 90 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              {suggestion.subtitle && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {suggestion.subtitle}
                                </p>
                              )}
                            </div>
                            
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {typeLabels[suggestion.type]}
                            </Badge>
                          </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                ))
              )}
            </CommandList>
          </Command>
          
          {query && (
            <div className="border-t p-3 bg-muted/50">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => handleSearch(query)}
                data-testid="search-all-results"
              >
                <Search className="w-4 h-4 mr-2" />
                Search for "{query}"
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}