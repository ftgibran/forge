import type { Metadata } from 'next'
import { type PropsWithChildren } from 'react'

import { Providers } from '@/components/providers'

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang={'en'} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browse and shop 3D printed products',
}
