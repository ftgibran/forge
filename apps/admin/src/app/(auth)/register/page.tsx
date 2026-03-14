'use client'

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
import { authApi } from '@/lib/api/auth'

export default function RegisterPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const tc = useTranslations('common')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.register(name, email, password)

      localStorage.setItem('token', res.accessToken)
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
            {t('adminPanel')}
          </Heading>
          <Text color={'fg.muted'} textAlign={'center'}>
            {t('signUpTitle')}
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={'4'}>
              <Field label={tc('name')}>
                <Input
                  placeholder={t('namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label={tc('email')}>
                <Input
                  type={'email'}
                  placeholder={t('emailUserPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label={tc('password')}>
                <Input
                  type={'password'}
                  placeholder={t('passwordMinLength')}
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
