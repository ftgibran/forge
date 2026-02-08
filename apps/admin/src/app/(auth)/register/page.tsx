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

export default function RegisterPage() {
  const router = useRouter()
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
        title: 'Registration failed',
        description: 'Please check your details and try again',
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
            Create a new account
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap='4'>
              <Field label='Name'>
                <Input
                  placeholder='Your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label='Email'>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label='Password'>
                <Input
                  type='password'
                  placeholder='Min. 6 characters'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Field>
              <Button type='submit' colorPalette='blue' loading={loading}>
                Sign up
              </Button>
            </Stack>
          </form>
        </Card.Body>
        <Card.Footer justifyContent='center'>
          <Text fontSize='sm' color='fg.muted'>
            Already have an account?{' '}
            <Link href='/login'>
              <Text as='span' color='blue.fg' fontWeight='medium'>
                Sign in
              </Text>
            </Link>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}
