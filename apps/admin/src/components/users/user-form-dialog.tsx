'use client'

import { Button, Input, Stack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('users')
  const tc = useTranslations('common')
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
        toaster.success({ title: t('userUpdated') })
      } else {
        await usersApi.create({ name, email, password })
        toaster.success({ title: t('userCreated') })
      }

      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({
        title: user ? tc('updateFailed') : tc('createFailed'),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? t('editUser') : t('createUser')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
              <Field label={tc('name')}>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label={tc('email')}>
                <Input
                  type={'email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field label={user ? t('passwordKeepEmpty') : tc('password')}>
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
              {tc('cancel')}
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {user ? tc('update') : tc('create')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
