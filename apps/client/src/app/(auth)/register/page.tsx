'use client'

import { useAuth } from '@app/sdk'
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
import { useState } from 'react'

import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      router.push('/')
    } catch {
      toaster.error({
        title: 'Registration failed',
        description: 'Could not create account. Please try again.',
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
            Create Account
          </Heading>
          <Text color={'fg.muted'} textAlign={'center'}>
            Join the Marketplace
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={'4'}>
              <Field label={'Name'}>
                <Input
                  placeholder={'Your name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label={'Email'}>
                <Input
                  type={'email'}
                  placeholder={'you@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label={'Password'}>
                <Input
                  type={'password'}
                  placeholder={'Create a password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Field>
              <Button type={'submit'} colorPalette={'blue'} loading={loading}>
                Sign up
              </Button>
            </Stack>
          </form>
        </Card.Body>
        <Card.Footer justifyContent={'center'}>
          <Text fontSize={'sm'} color={'fg.muted'}>
            Already have an account?{' '}
            <Link href={'/login'}>
              <Text as={'span'} color={'blue.fg'} fontWeight={'medium'}>
                Sign in
              </Text>
            </Link>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
