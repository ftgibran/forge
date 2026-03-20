'use client'

import { SdkProvider } from '@app/sdk'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SdkProvider
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'}
    >
      {children}
    </SdkProvider>
  )
}
