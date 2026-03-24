import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { type PropsWithChildren } from 'react'

import { AppProviders } from '@/components/AppProviders'

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin panel for managing users, roles, and permissions',
}
