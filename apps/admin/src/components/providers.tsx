'use client'

import { SdkProvider } from '@app/sdk'
import type { PropsWithChildren } from 'react'

import { DesignSystemProvider } from '@/components/ui/design-system-provider'
import { Toaster } from '@/components/ui/toaster'
import { API_URL } from '@/config/constants'

export function Providers({ children }: PropsWithChildren) {
  return (
    <SdkProvider apiUrl={API_URL}>
      <DesignSystemProvider>
        {children}

        <Toaster />
      </DesignSystemProvider>
    </SdkProvider>
  )
}
