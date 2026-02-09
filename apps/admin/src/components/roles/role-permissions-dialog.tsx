'use client'

import { formatPermission } from '@app/utils'
import { Badge, Button, Flex, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'
import { permissionsApi } from '@/lib/api/permissions'
import { rolesApi } from '@/lib/api/roles'
import type { Permission, Role } from '@/types'

interface RolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSaved: () => void
}

export function RolePermissionsDialog({
  open,
  onOpenChange,
  role,
  onSaved,
}: RolePermissionsDialogProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !role) return

    setLoading(true)
    Promise.all([permissionsApi.list(1, 100), rolesApi.get(role.id)])
      .then(([permsRes, freshRole]) => {
        setAllPermissions(permsRes.items)
        setAssignedIds(
          new Set(
            freshRole.rolePermissions?.map((rp) => rp.permission.id) ?? [],
          ),
        )
      })
      .finally(() => setLoading(false))
  }, [open, role])

  const toggle = async (permissionId: string) => {
    if (!role) return

    setActionLoading(permissionId)
    try {
      if (assignedIds.has(permissionId)) {
        await rolesApi.removePermission(role.id, permissionId)
        setAssignedIds((prev) => {
          const next = new Set(prev)

          next.delete(permissionId)

          return next
        })
        toaster.success({ title: 'Permission removed' })
      } else {
        await rolesApi.assignPermission(role.id, permissionId)
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
          <DialogTitle>Permissions for {role?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {loading ? (
            <Flex justify={'center'} py={'4'}>
              <Spinner />
            </Flex>
          ) : (
            <Stack gap={'2'}>
              {allPermissions.map((perm) => (
                <Flex key={perm.id} align={'center'} justify={'space-between'}>
                  <Flex align={'center'} gap={'2'}>
                    <Text fontWeight={'medium'}>
                      {formatPermission(perm.action, perm.resource)}
                    </Text>
                    {assignedIds.has(perm.id) && (
                      <Badge colorPalette={'green'} size={'sm'}>
                        Assigned
                      </Badge>
                    )}
                  </Flex>
                  <Button
                    size={'sm'}
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
