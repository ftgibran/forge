'use client'

import { FC, PropsWithChildren } from 'react'
import { CookiesProvider } from 'react-cookie'

import { AuthProvider } from '../auth'
import { ApiClientProvider } from '../client'

export type SdkProviderProps = PropsWithChildren<{
  apiUrl: string
}>

export const SdkProvider: FC<SdkProviderProps> = (props) => {
  const { apiUrl, children } = props

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <ApiClientProvider apiUrl={apiUrl}>
        <AuthProvider>{children}</AuthProvider>
      </ApiClientProvider>
    </CookiesProvider>
  )
}
