import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">{children}</main>
}
