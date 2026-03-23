'use client'

import { SdkProvider } from '@app/sdk'
import { DesignSystemProvider } from '@app/theme'
import { Toaster } from '@app/theme'
import type { PropsWithChildren } from 'react'

import { API_URL } from '@/config/constants'

export function Providers({ children }: PropsWithChildren) {
  return (
    <SdkProvider apiUrl={API_URL} tokenKey={'token'}>
      <DesignSystemProvider>
        {children}

        <Toaster />
      </DesignSystemProvider>
    </SdkProvider>
  )
}
