'use client'

import { Box, Button, Heading, Icon, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LuBox,
  LuFolderTree,
  LuKey,
  LuLayoutDashboard,
  LuShield,
  LuShoppingCart,
  LuStar,
  LuStore,
  LuUser,
  LuUsers,
} from 'react-icons/lu'

const navItems = [
  { href: '/', labelKey: 'dashboard', icon: LuLayoutDashboard },
  { href: '/users', labelKey: 'users', icon: LuUsers },
  { href: '/roles', labelKey: 'roles', icon: LuShield },
  { href: '/permissions', labelKey: 'permissions', icon: LuKey },
  { href: '/vendors', labelKey: 'vendors', icon: LuStore },
  { href: '/categories', labelKey: 'categories', icon: LuFolderTree },
  { href: '/products', labelKey: 'products', icon: LuBox },
  { href: '/orders', labelKey: 'orders', icon: LuShoppingCart },
  { href: '/reviews', labelKey: 'reviews', icon: LuStar },
  { href: '/profile', labelKey: 'profile', icon: LuUser },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const t = useTranslations('nav')

  return (
    <Box
      as={'nav'}
      pos={'fixed'}
      top={'0'}
      left={'0'}
      h={'100vh'}
      w={'240px'}
      bg={'bg.panel'}
      borderRightWidth={'1px'}
      py={'4'}
      px={'3'}
    >
      <Heading size={'md'} px={'3'} mb={'6'}>
        {t('admin')}
      </Heading>
      <Stack gap={'1'}>
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

          return (
            <Button
              key={item.href}
              asChild
              variant={active ? 'subtle' : 'ghost'}
              justifyContent={'flex-start'}
              w={'full'}
            >
              <Link href={item.href}>
                <Icon>
                  <item.icon />
                </Icon>
                {t(item.labelKey)}
              </Link>
            </Button>
          )
        })}
      </Stack>
    </Box>
  )
}
