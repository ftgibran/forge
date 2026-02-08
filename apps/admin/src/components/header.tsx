'use client'

import { Flex, Text } from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { ColorModeButton } from '@/components/ui/color-mode'
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu'
import { useAuth } from '@/lib/auth-context'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <Flex
      as='header'
      h='16'
      align='center'
      justify='flex-end'
      px='6'
      gap='3'
      borderBottomWidth='1px'
      bg='bg.panel'
    >
      <ColorModeButton />
      <MenuRoot>
        <MenuTrigger asChild>
          <button>
            <Avatar size='sm' name={user?.name} cursor='pointer' />
          </button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value='info' disabled>
            <Text fontWeight='medium'>{user?.name}</Text>
          </MenuItem>
          <MenuItem value='email' disabled>
            <Text fontSize='sm' color='fg.muted'>
              {user?.email}
            </Text>
          </MenuItem>
          <MenuItem value='logout' onClick={logout}>
            Sign out
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Flex>
  )
}
