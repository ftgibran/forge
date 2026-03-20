'use client'

import { useApiClient } from '@app/sdk'
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

import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const client = useApiClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post<{ accessToken: string }>('/auth/login', {
        email,
        password,
      })

      localStorage.setItem('token', res.accessToken)
      router.push('/')
    } catch {
      toaster.error({
        title: t('loginFailed'),
        description: t('invalidCredentials'),
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
            {t('adminPanel')}
          </Heading>
          <Text color={'fg.muted'} textAlign={'center'}>
            {t('signInTitle')}
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={'4'}>
              <Field label={tc('email')}>
                <Input
                  type={'email'}
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label={tc('password')}>
                <Input
                  type={'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Button type={'submit'} colorPalette={'blue'} loading={loading}>
                {t('signIn')}
              </Button>
            </Stack>
          </form>
        </Card.Body>
        <Card.Footer justifyContent={'center'}>
          <Text fontSize={'sm'} color={'fg.muted'}>
            {t('noAccount')}{' '}
            <Link href={'/register'}>
              <Text as={'span'} color={'blue.fg'} fontWeight={'medium'}>
                {t('signUp')}
              </Text>
            </Link>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
