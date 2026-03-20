'use client'

import { SdkProvider } from '@app/sdk'
import type { ReactNode } from 'react'

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SdkProvider
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'}
      getToken={getToken}
    >
      {children}
    </SdkProvider>
  )
}
