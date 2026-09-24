import { useCallback, useEffect, useRef, useState } from 'react'

type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export type AsyncResult<T> = AsyncState<T> & {
  refetch: () => void
}

/**
 * Minimal data-fetching hook: loading/error/data plus a retry, with in-flight
 * results discarded when the inputs change or the component unmounts (so a
 * slow request for one slug can't overwrite a newer one).
 *
 * `deps` works like a useEffect dependency list -- pass whatever the fetcher
 * closes over (a slug, a filter) so it re-runs when those change.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const [reloadToken, setReloadToken] = useState(0)

  // Latest-ref so a re-rendered inline fetcher doesn't retrigger the effect.
  // Declared before the fetch effect below so it syncs first on every render.
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    let cancelled = false
    // Intentional: a dependency change means new inputs, so the previous
    // result must not stay on screen while the new request is in flight.
    // eslint-disable-next-line react/set-state-in-effect
    setState({ data: null, loading: true, error: null })

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        console.error('[ASTERA] data request failed', cause)
        setState({
          data: null,
          loading: false,
          error: cause instanceof Error ? cause : new Error(String(cause)),
        })
      })

    return () => {
      cancelled = true
    }
    // Caller-supplied deps are spread in by design — this hook is generic, so
    // the list can't be statically known here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken])

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  return { ...state, refetch }
}
