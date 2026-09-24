import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'signed-out' | 'admin' | 'not-admin'

export type AuthContextValue = {
  status: AuthStatus
  session: Session | null
  email: string | null
  fullName: string | null
  /** Set when the session loaded but the profile lookup itself failed. */
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
