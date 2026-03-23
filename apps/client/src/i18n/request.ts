import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'pt-BR'] as const
const defaultLocale = 'en'

export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const raw = cookieStore.get('NEXT_LOCALE')?.value
  const locale = locales.includes(raw as Locale)
    ? (raw as Locale)
    : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
