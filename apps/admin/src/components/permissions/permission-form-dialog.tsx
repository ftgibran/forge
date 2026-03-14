'use client'

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
import { permissionsApi } from '@/lib/api/permissions'
import type { Permission } from '@/types'

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
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = { action, resource, description: description || undefined }

      if (permission) {
        await permissionsApi.update(permission.id, data)
        toaster.success({ title: t('permissionUpdated') })
      } else {
        await permissionsApi.create(data)
        toaster.success({ title: t('permissionCreated') })
      }

      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({
        title: permission ? tc('updateFailed') : tc('createFailed'),
      })
    } finally {
      setLoading(false)
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
