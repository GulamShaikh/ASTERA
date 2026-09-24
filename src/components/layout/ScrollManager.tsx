import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/** Scroll offset per history entry, so Back returns to where you were. */
const savedPositions = new Map<string, number>()

/**
 * React Router doesn't scroll on navigation. This handles all three cases:
 * a `/#section` link from another route, a normal forward navigation (top),
 * and Back/Forward (restore the previous offset).
 *
 * The double rAF gives the destination route a frame to render — scrolling
 * before that would target a page with no height yet.
 */
export function ScrollManager() {
  const { hash, pathname, key } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    return () => {
      savedPositions.set(key, window.scrollY)
    }
  }, [key])

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
      return
    }

    if (navigationType === 'POP') {
      const target = savedPositions.get(key) ?? 0
      if (target === 0) {
        window.scrollTo({ top: 0, left: 0 })
        return
      }

      // The restored page fetches its own data, so it starts too short to
      // scroll to the old offset. Wait until the document is tall enough
      // (or give up), then scroll exactly once — retrying afterwards would
      // fight a visitor who has started scrolling themselves.
      const deadline = Date.now() + 1500
      let timer = 0

      const restoreWhenTallEnough = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll >= target - 2 || Date.now() > deadline) {
          window.scrollTo({ top: target, left: 0 })
          return
        }
        timer = window.setTimeout(restoreWhenTallEnough, 80)
      }

      restoreWhenTallEnough()
      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0 })
  }, [hash, pathname, key, navigationType])

  return null
}
