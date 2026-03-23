'use client'

import { useGetCart } from '@app/sdk'
import { useAuth } from '@app/sdk'
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
import { useState } from 'react'
import { LuSearch, LuShoppingCart, LuStore } from 'react-icons/lu'

import { ColorModeButton } from '@/components/ui/color-mode'
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu'

export function Navbar() {
  const { currentUser, logout } = useAuth()
  const { data: cart } = useGetCart()
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const router = useRouter()
  const [search, setSearch] = useState('')

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
                Marketplace
              </Text>
            </HStack>
          </Link>

          <HStack gap={'4'} hideBelow={'md'}>
            <Button asChild variant={'ghost'} size={'sm'}>
              <Link href={'/products'}>Products</Link>
            </Button>
            <Button asChild variant={'ghost'} size={'sm'}>
              <Link href={'/categories'}>Categories</Link>
            </Button>
          </HStack>

          <Box flex={'1'} maxW={'md'} mx={'auto'}>
            <form onSubmit={handleSearch}>
              <HStack>
                <Input
                  placeholder={'Search products...'}
                  size={'sm'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  type={'submit'}
                  aria-label={'Search'}
                  variant={'ghost'}
                  size={'sm'}
                >
                  <LuSearch />
                </IconButton>
              </HStack>
            </form>
          </Box>

          <HStack gap={'2'}>
            <ColorModeButton />

            {currentUser ? (
              <>
                <Box position={'relative'}>
                  <IconButton
                    asChild
                    aria-label={'Cart'}
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
                      <Link href={'/profile'}>Profile</Link>
                    </MenuItem>
                    <MenuItem asChild value={'orders'}>
                      <Link href={'/orders'}>Orders</Link>
                    </MenuItem>
                    <MenuItem asChild value={'sell'}>
                      <Link href={'/sell'}>Become a Seller</Link>
                    </MenuItem>
                    <MenuItem value={'logout'} onClick={logout}>
                      Sign out
                    </MenuItem>
                  </MenuContent>
                </MenuRoot>
              </>
            ) : (
              <HStack gap={'2'}>
                <Button asChild variant={'ghost'} size={'sm'}>
                  <Link href={'/login'}>Sign In</Link>
                </Button>
                <Button asChild colorPalette={'blue'} size={'sm'}>
                  <Link href={'/register'}>Sign Up</Link>
                </Button>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
