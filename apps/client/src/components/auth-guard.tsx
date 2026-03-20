'use client'

import { useAuth } from '@app/sdk'
import { Spinner, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <VStack minH={'50vh'} justify={'center'}>
        <Spinner size={'xl'} />
      </VStack>
    )
  }

  if (!user) return null

  return <>{children}</>
}
