'use client'

import { Button, Input, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { usersApi } from '@/lib/api/users'
import type { User } from '@/types'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSaved: () => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: UserFormDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPassword('')
    } else {
      setName('')
      setEmail('')
      setPassword('')
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (user) {
        const data: Record<string, string> = { name, email }

        if (password) data.password = password

        await usersApi.update(user.id, data)
        toaster.success({ title: 'User updated' })
      } else {
        await usersApi.create({ name, email, password })
        toaster.success({ title: 'User created' })
      }

      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({ title: user ? 'Update failed' : 'Create failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
              <Field label={'Name'}>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label={'Email'}>
                <Input
                  type={'email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field
                label={user ? 'Password (leave empty to keep)' : 'Password'}
              >
                <Input
                  type={'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!user}
                  minLength={6}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {user ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
