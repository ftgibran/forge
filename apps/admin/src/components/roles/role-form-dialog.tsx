'use client'

import type { Role } from '@app/sdk'
import { useCreateRole, useUpdateRole } from '@app/sdk'
import { Button, Input, Stack, Textarea } from '@chakra-ui/react'
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

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSaved: () => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSaved,
}: RoleFormDialogProps) {
  const t = useTranslations('roles')
  const tc = useTranslations('common')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const loading = createRole.isPending || updateRole.isPending

  useEffect(() => {
    if (role) {
      setName(role.name)
      setDescription(role.description ?? '')
    } else {
      setName('')
      setDescription('')
    }
  }, [role, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { name, description: description || undefined }

    if (role) {
      updateRole.mutate(
        { id: role.id, data },
        {
          onSuccess: () => {
            toaster.success({ title: t('roleUpdated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('updateFailed') })
          },
        },
      )
    } else {
      createRole.mutate(data, {
        onSuccess: () => {
          toaster.success({ title: t('roleCreated') })
          onOpenChange(false)
          onSaved()
        },
        onError: () => {
          toaster.error({ title: tc('createFailed') })
        },
      })
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? t('editRole') : t('createRole')}</DialogTitle>
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
              <Field label={tc('description')}>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {role ? tc('update') : tc('create')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
