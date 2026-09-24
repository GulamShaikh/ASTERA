import { useEffect } from 'react'

/**
 * Browser-level guard for closing/reloading the tab with unsaved edits.
 * In-app navigation isn't intercepted — React Router's declarative API has no
 * blocker without switching to a data router, which isn't worth it here.
 */
export function useUnsavedChangesWarning(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [enabled])
}
