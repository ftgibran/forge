'use client'

import { AuthGateway } from '@app/sdk'
import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <AuthGateway onReject={() => router.push('/login')}>
      <Flex minH={'100vh'}>
        <Sidebar />
        <Box flex={'1'} ml={'240px'}>
          <Header />
          <Box as={'main'} p={'6'}>
            {children}
          </Box>
        </Box>
      </Flex>
    </AuthGateway>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
