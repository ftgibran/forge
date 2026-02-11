import type { Metadata } from 'next'

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
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
