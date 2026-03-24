'use client'

import { AuthGateway } from '@app/sdk'
import { useRouter } from 'next/navigation'
import { type PropsWithChildren } from 'react'

export function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter()

  return (
    <AuthGateway onReject={() => router.push('/login')}>{children}</AuthGateway>
  )
}
