'use client'

import { Box } from '@chakra-ui/react'

import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { AuthProvider } from '@/lib/auth-context'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider
      apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}
    >
      <Navbar />
      <Box as={'main'} minH={'calc(100vh - 64px)'}>
        {children}
      </Box>
      <Footer />
    </AuthProvider>
  )
}
