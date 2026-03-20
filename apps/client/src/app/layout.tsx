import type { Metadata } from 'next'

import { Provider } from '@/components/ui/provider'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryProvider } from '@/lib/query-client'

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
        <ReactQueryProvider>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
