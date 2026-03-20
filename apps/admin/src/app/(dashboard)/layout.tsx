'use client'

import { Box, Flex, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { AuthProvider, useAuth } from '@/lib/auth-context'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <Flex h={'100vh'} align={'center'} justify={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )
  }

  if (!user) return null

  return (
    <Flex minH={'100vh'}>
      <Sidebar />
      <Box flex={'1'} ml={'240px'}>
        <Header />
        <Box as={'main'} p={'6'}>
          {children}
        </Box>
      </Box>
    </Flex>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider
      apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}
    >
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  )
}
