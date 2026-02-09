'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Box, Heading, Stack, Button, Icon } from '@chakra-ui/react'
import {
  LuLayoutDashboard,
  LuUsers,
  LuShield,
  LuKey,
  LuUser,
  LuStore,
  LuFolderTree,
  LuBox,
  LuShoppingCart,
  LuStar,
} from 'react-icons/lu'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LuLayoutDashboard },
  { href: '/users', label: 'Users', icon: LuUsers },
  { href: '/roles', label: 'Roles', icon: LuShield },
  { href: '/permissions', label: 'Permissions', icon: LuKey },
  { href: '/vendors', label: 'Vendors', icon: LuStore },
  { href: '/categories', label: 'Categories', icon: LuFolderTree },
  { href: '/products', label: 'Products', icon: LuBox },
  { href: '/orders', label: 'Orders', icon: LuShoppingCart },
  { href: '/reviews', label: 'Reviews', icon: LuStar },
  { href: '/profile', label: 'Profile', icon: LuUser },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <Box
      as='nav'
      pos='fixed'
      top='0'
      left='0'
      h='100vh'
      w='240px'
      bg='bg.panel'
      borderRightWidth='1px'
      py='4'
      px='3'
    >
      <Heading size='md' px='3' mb='6'>
        Admin
      </Heading>
      <Stack gap='1'>
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
              justifyContent='flex-start'
              w='full'
            >
              <Link href={item.href}>
                <Icon>
                  <item.icon />
                </Icon>
                {item.label}
              </Link>
            </Button>
          )
        })}
      </Stack>
    </Box>
  )
}
