'use client'

import { useState, useEffect } from 'react'
import { Button, Stack, Badge, Flex, Text, Spinner } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'
import { formatPermission } from '@app/utils'
import { usersApi } from '@/lib/api/users'
import { permissionsApi } from '@/lib/api/permissions'
import type { User, Permission } from '@/types'

interface UserPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSaved: () => void
}

export function UserPermissionsDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: UserPermissionsDialogProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return
    setLoading(true)
    Promise.all([permissionsApi.list(1, 100), usersApi.get(user.id)])
      .then(([permsRes, freshUser]) => {
        setAllPermissions(permsRes.items)
        setAssignedIds(
          new Set(
            freshUser.userPermissions?.map((up) => up.permission.id) ?? [],
          ),
        )
      })
      .finally(() => setLoading(false))
  }, [open, user])

  const toggle = async (permissionId: string) => {
    if (!user) return
    setActionLoading(permissionId)
    try {
      if (assignedIds.has(permissionId)) {
        await usersApi.removePermission(user.id, permissionId)
        setAssignedIds((prev) => {
          const next = new Set(prev)
          next.delete(permissionId)
          return next
        })
        toaster.success({ title: 'Permission removed' })
      } else {
        await usersApi.assignPermission(user.id, permissionId)
        setAssignedIds((prev) => new Set(prev).add(permissionId))
        toaster.success({ title: 'Permission assigned' })
      }
      onSaved()
    } catch {
      toaster.error({ title: 'Operation failed' })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Direct Permissions for {user?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {loading ? (
            <Flex justify='center' py='4'>
              <Spinner />
            </Flex>
          ) : (
            <Stack gap='2'>
              {allPermissions.map((perm) => (
                <Flex key={perm.id} align='center' justify='space-between'>
                  <Flex align='center' gap='2'>
                    <Text fontWeight='medium'>
                      {formatPermission(perm.action, perm.resource)}
                    </Text>
                    {assignedIds.has(perm.id) && (
                      <Badge colorPalette='green' size='sm'>
                        Assigned
                      </Badge>
                    )}
                  </Flex>
                  <Button
                    size='sm'
                    variant={assignedIds.has(perm.id) ? 'outline' : 'solid'}
                    colorPalette={assignedIds.has(perm.id) ? 'red' : 'blue'}
                    onClick={() => toggle(perm.id)}
                    loading={actionLoading === perm.id}
                  >
                    {assignedIds.has(perm.id) ? 'Remove' : 'Assign'}
                  </Button>
                </Flex>
              ))}
            </Stack>
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
