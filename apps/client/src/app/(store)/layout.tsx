'use client'

import { Box } from '@chakra-ui/react'

import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <Box as={'main'} minH={'calc(100vh - 64px)'}>
        {children}
      </Box>
      <Footer />
    </>
  )
}
