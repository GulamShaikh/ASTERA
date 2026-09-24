import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { AuthContext, type AuthStatus } from '../../lib/authContext'

type ProfileState = {
  status: AuthStatus
  fullName: string | null
  error: Error | null
}

const SIGNED_OUT: ProfileState = { status: 'signed-out', fullName: null, error: null }

/**
 * Wraps the /admin subtree only — the public site never needs a session, so it
 * doesn't pay for this lookup.
 *
 * This is UX-level gating. The real boundary is RLS: a non-admin who bypassed
 * this still can't read drafts or write anything.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileState>({ status: 'loading', fullName: null, error: null })

  useEffect(() => {
    let cancelled = false

    async function resolveRole(nextSession: Session | null) {
      if (!nextSession) {
        if (!cancelled) setProfile(SIGNED_OUT)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', nextSession.user.id)
        .maybeSingle()

      if (cancelled) return

      if (error) {
        setProfile({ status: 'not-admin', fullName: null, error: new Error(error.message) })
        return
      }

      setProfile({
        status: data?.role === 'admin' ? 'admin' : 'not-admin',
        fullName: (data?.full_name as string | null) ?? null,
        error: null,
      })
    }

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session)
      void resolveRole(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return
      setSession(nextSession)
      setProfile({ status: 'loading', fullName: null, error: null })
      void resolveRole(nextSession)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }, [])

  const value = useMemo(
    () => ({
      status: profile.status,
      session,
      email: session?.user.email ?? null,
      fullName: profile.fullName,
      error: profile.error,
      signIn,
      signOut,
    }),
    [profile, session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
