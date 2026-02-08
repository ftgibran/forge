'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

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
      <Flex h='100vh' align='center' justify='center'>
        <Spinner size='xl' />
      </Flex>
    )
  }

  if (!user) return null

  return (
    <Flex minH='100vh'>
      <Sidebar />
      <Box flex='1' ml='240px'>
        <Header />
        <Box as='main' p='6'>
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
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  )
}
