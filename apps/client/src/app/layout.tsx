import type { Metadata } from 'next'

import { Providers } from '@/components/providers'
import { Provider } from '@/components/ui/provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browse and shop 3D printed products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={'en'} suppressHydrationWarning>
      <body>
        <Providers>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </Providers>
      </body>
    </html>
  )
}
