'use client'

import { useGetCart } from '@app/sdk'
import { useAuth } from '@app/sdk'
import { ColorModeButton } from '@app/theme'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@app/theme'
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuSearch, LuShoppingCart, LuStore } from 'react-icons/lu'

import { LocaleSwitcher } from '@/components/locale-switcher'

export function Navbar() {
  const { currentUser, logout } = useAuth()
  const { data: cart } = useGetCart()
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const router = useRouter()
  const [search, setSearch] = useState('')
  const tn = useTranslations('nav')
  const t = useTranslations('navbar')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <Box
      as={'nav'}
      borderBottomWidth={'1px'}
      bg={'bg'}
      position={'sticky'}
      top={'0'}
      zIndex={'sticky'}
    >
      <Container maxW={'7xl'} py={'3'} px={'4'}>
        <Flex align={'center'} gap={'4'}>
          <Link href={'/'}>
            <HStack gap={'2'}>
              <LuStore size={24} />
              <Text fontWeight={'bold'} fontSize={'lg'} hideBelow={'md'}>
                {tn('marketplace')}
              </Text>
            </HStack>
          </Link>

          <HStack gap={'4'} hideBelow={'md'}>
            <Button asChild variant={'ghost'} size={'sm'}>
              <Link href={'/products'}>{tn('products')}</Link>
            </Button>
            <Button asChild variant={'ghost'} size={'sm'}>
              <Link href={'/categories'}>{tn('categories')}</Link>
            </Button>
          </HStack>

          <Box flex={'1'} maxW={'md'} mx={'auto'}>
            <form onSubmit={handleSearch}>
              <HStack>
                <Input
                  placeholder={t('searchPlaceholder')}
                  size={'sm'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  type={'submit'}
                  aria-label={t('searchAriaLabel')}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <LuSearch />
                </IconButton>
              </HStack>
            </form>
          </Box>

          <HStack gap={'2'}>
            <LocaleSwitcher />
            <ColorModeButton />

            {currentUser ? (
              <>
                <Box position={'relative'}>
                  <IconButton
                    asChild
                    aria-label={t('cartAriaLabel')}
                    variant={'ghost'}
                    size={'sm'}
                  >
                    <Link href={'/cart'}>
                      <LuShoppingCart />
                    </Link>
                  </IconButton>
                  {cartCount > 0 && (
                    <Badge
                      colorPalette={'red'}
                      position={'absolute'}
                      top={'-1'}
                      right={'-1'}
                      borderRadius={'full'}
                      size={'xs'}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Box>

                <MenuRoot>
                  <MenuTrigger asChild>
                    <Button variant={'ghost'} size={'sm'}>
                      {currentUser.name}
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem asChild value={'profile'}>
                      <Link href={'/profile'}>{tn('profile')}</Link>
                    </MenuItem>
                    <MenuItem asChild value={'orders'}>
                      <Link href={'/orders'}>{tn('orders')}</Link>
                    </MenuItem>
                    <MenuItem asChild value={'sell'}>
                      <Link href={'/sell'}>{t('becomeASeller')}</Link>
                    </MenuItem>
                    <MenuItem value={'logout'} onClick={logout}>
                      {t('signOut')}
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
              </>
            ) : (
              <HStack gap={'2'}>
                <Button asChild variant={'ghost'} size={'sm'}>
                  <Link href={'/login'}>{t('signIn')}</Link>
                </Button>
                <Button asChild colorPalette={'blue'} size={'sm'}>
                  <Link href={'/register'}>{t('signUp')}</Link>
                </Button>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
