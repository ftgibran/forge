'use client'

import { Button, Input, Stack, Textarea } from '@chakra-ui/react'
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
        toaster.success({ title: 'Permission updated' })
      } else {
        await permissionsApi.create(data)
        toaster.success({ title: 'Permission created' })
      }

      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({
        title: permission ? 'Update failed' : 'Create failed',
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
            {permission ? 'Edit Permission' : 'Create Permission'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
              <Field label={'Action'}>
                <Input
                  placeholder={'e.g. create, read, update, delete'}
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  required
                />
              </Field>
              <Field label={'Resource'}>
                <Input
                  placeholder={'e.g. user, role, permission'}
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  required
                />
              </Field>
              <Field label={'Description'}>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {permission ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
