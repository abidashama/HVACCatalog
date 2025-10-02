import { useLocation } from 'wouter'
import { useCallback } from 'react'

/**
 * Custom hook for managing URL query parameters
 * Provides a clean API for updating URL params with React Router
 */
export function useUrlParams() {
  const [location, setLocation] = useLocation()

  /**
   * Update URL query parameters
   * @param params - Object with key-value pairs to update
   *                 Set value to undefined or null to remove the param
   */
  const updateParams = useCallback((params: Record<string, string | number | undefined | null>) => {
    const urlParams = new URLSearchParams(window.location.search)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.set(key, value.toString())
      } else {
        urlParams.delete(key)
      }
    })
    
    const currentPath = location.split('?')[0]
    const newUrl = urlParams.toString() ? `${currentPath}?${urlParams}` : currentPath
    
    // Use history.pushState for URL update without navigation
    window.history.pushState({}, '', newUrl)
  }, [location, setLocation])

  /**
   * Get a specific URL parameter value
   * @param key - Parameter key to retrieve
   * @returns Parameter value or null
   */
  const getParam = useCallback((key: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(key)
  }, [])

  /**
   * Get all URL parameters as an object
   * @returns Object with all query parameters
   */
  const getAllParams = useCallback((): Record<string, string> => {
    const urlParams = new URLSearchParams(window.location.search)
    const params: Record<string, string> = {}
    
    urlParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  }, [])

  /**
   * Clear all URL parameters
   */
  const clearParams = useCallback(() => {
    const currentPath = location.split('?')[0]
    window.history.pushState({}, '', currentPath)
  }, [location])

  return {
    updateParams,
    getParam,
    getAllParams,
    clearParams
  }
}

