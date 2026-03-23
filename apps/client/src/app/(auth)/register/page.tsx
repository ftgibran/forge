'use client'

import { useAuth } from '@app/sdk'
import { Field } from '@app/theme'
import { toaster } from '@app/theme'
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const t = useTranslations('auth')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      router.push('/')
    } catch {
      toaster.error({
        title: t('registrationFailed'),
        description: t('registrationError'),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box w={'full'} maxW={'sm'}>
      <Card.Root>
        <Card.Header>
          <Heading size={'lg'} textAlign={'center'}>
            {t('registerHeading')}
          </Heading>
          <Text color={'fg.muted'} textAlign={'center'}>
            {t('registerSubtitle')}
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={'4'}>
              <Field label={t('nameLabel')}>
                <Input
                  placeholder={t('namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label={t('emailLabel')}>
                <Input
                  type={'email'}
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label={t('passwordLabel')}>
                <Input
                  type={'password'}
                  placeholder={t('registerPasswordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Field>
              <Button type={'submit'} colorPalette={'blue'} loading={loading}>
                {t('signUp')}
              </Button>
            </Stack>
          </form>
        </Card.Body>
        <Card.Footer justifyContent={'center'}>
          <Text fontSize={'sm'} color={'fg.muted'}>
            {t('hasAccount')}{' '}
            <Link href={'/login'}>
              <Text as={'span'} color={'blue.fg'} fontWeight={'medium'}>
                {t('signIn')}
              </Text>
            </Link>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
