'use client'

import { IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { LuGlobe } from 'react-icons/lu'

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu'

const locales = ['en', 'pt-BR'] as const

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`
}

export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher')
  const locale = useLocale()
  const router = useRouter()

  const switchLocale = useCallback(
    (newLocale: string) => {
      setLocaleCookie(newLocale)
      router.refresh()
    },
    [router],
  )

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant={'ghost'} size={'sm'} aria-label={t('label')}>
          <LuGlobe />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        {locales.map((l) => (
          <MenuItem
            key={l}
            value={l}
            fontWeight={locale === l ? 'bold' : 'normal'}
            onClick={() => switchLocale(l)}
          >
            {t(l)}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  )
}
