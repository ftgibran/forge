'use client'

import { Box } from '@chakra-ui/react'

import { AppFooter } from '@/components/layout/AppFooter'
import { AppNavbar } from '@/components/layout/AppNavbar'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppNavbar />
      <Box as={'main'} minH={'calc(100vh - 64px)'}>
        {children}
      </Box>
      <AppFooter />
    </>
  )
}
