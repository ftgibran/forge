import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { Providers } from '@/components/providers'
import { Provider } from '@/components/ui/provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin panel for managing users, roles, and permissions',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
