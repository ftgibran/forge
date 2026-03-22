'use client'

import { useAuth } from '@app/sdk'
import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  if (!currentUser) return null

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
  return <DashboardShell>{children}</DashboardShell>
}
