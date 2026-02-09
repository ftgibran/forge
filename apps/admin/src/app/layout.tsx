import type { Metadata } from 'next'

import { Provider } from '@/components/ui/provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin panel for managing users, roles, and permissions',
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
