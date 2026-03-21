'use client'

import type { Permission } from '@app/sdk'
import { useCreatePermission, useUpdatePermission } from '@app/sdk'
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

interface PermissionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission: Permission | null
  onSaved: () => void
}

export function PermissionFormDialog({
  open,
  onOpenChange,
  permission,
  onSaved,
}: PermissionFormDialogProps) {
  const t = useTranslations('permissions')
  const tc = useTranslations('common')
  const [action, setAction] = useState('')
  const [resource, setResource] = useState('')
  const [description, setDescription] = useState('')

  const createPermission = useCreatePermission()
  const updatePermission = useUpdatePermission()

  const loading = createPermission.isPending || updatePermission.isPending

  useEffect(() => {
    if (permission) {
      setAction(permission.action)
      setResource(permission.resource)
      setDescription(permission.description ?? '')
    } else {
      setAction('')
      setResource('')
      setDescription('')
    }
  }, [permission, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { action, resource, description: description || undefined }

    if (permission) {
      updatePermission.mutate(
        { id: permission.id, data },
        {
          onSuccess: () => {
            toaster.success({ title: t('permissionUpdated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('updateFailed') })
          },
        },
      )
    } else {
      createPermission.mutate(
        { data },
        {
          onSuccess: () => {
            toaster.success({ title: t('permissionCreated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('createFailed') })
          },
        },
      )
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {permission ? t('editPermission') : t('createPermission')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
              <Field label={t('action')}>
                <Input
                  placeholder={t('actionPlaceholder')}
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  required
                />
              </Field>
              <Field label={t('resource')}>
                <Input
                  placeholder={t('resourcePlaceholder')}
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
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
              {permission ? tc('update') : tc('create')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
