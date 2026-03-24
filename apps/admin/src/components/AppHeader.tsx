'use client'

import { useAuth } from '@app/sdk'
import { Avatar } from '@app/theme'
import { ColorModeButton } from '@app/theme'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@app/theme'
import { Flex, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export function AppHeader() {
  const { currentUser, logout } = useAuth()
  const t = useTranslations('auth')

  return (
    <Flex
      as={'header'}
      h={'16'}
      align={'center'}
      justify={'flex-end'}
      px={'6'}
      gap={'3'}
      borderBottomWidth={'1px'}
      bg={'bg.panel'}
    >
      <LocaleSwitcher />
      <ColorModeButton />
      <MenuRoot>
        <MenuTrigger asChild>
          <button>
            <Avatar size={'sm'} name={currentUser?.name} cursor={'pointer'} />
          </button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value={'info'} disabled>
            <Text fontWeight={'medium'}>{currentUser?.name}</Text>
          </MenuItem>

          <MenuItem value={'email'} disabled>
            <Text fontSize={'sm'} color={'fg.muted'}>
              {currentUser?.email}
            </Text>
          </MenuItem>

          <MenuItem value={'logout'} onClick={logout}>
            {t('signOut')}
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Flex>
  )
}
