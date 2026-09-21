import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Handles links like `/#brand-discovery` from another route: React Router
 * navigates but never auto-scrolls to a hash target itself, so this does it
 * after the destination page has rendered.
 */
export function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }, [hash, pathname])

  return null
}
