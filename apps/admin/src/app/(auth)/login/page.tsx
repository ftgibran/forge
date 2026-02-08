'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { authApi } from '@/lib/api/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      localStorage.setItem('token', res.accessToken)
      router.push('/')
    } catch {
      toaster.error({
        title: 'Login failed',
        description: 'Invalid credentials',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box w='full' maxW='sm'>
      <Card.Root>
        <Card.Header>
          <Heading size='lg' textAlign='center'>
            Admin Panel
          </Heading>
          <Text color='fg.muted' textAlign='center'>
            Sign in to your account
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap='4'>
              <Field label='Email'>
                <Input
                  type='email'
                  placeholder='admin@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label='Password'>
                <Input
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Button type='submit' colorPalette='blue' loading={loading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Card.Body>
        <Card.Footer justifyContent='center'>
          <Text fontSize='sm' color='fg.muted'>
            Don&apos;t have an account?{' '}
            <Link href='/register'>
              <Text as='span' color='blue.fg' fontWeight='medium'>
                Sign up
              </Text>
            </Link>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
