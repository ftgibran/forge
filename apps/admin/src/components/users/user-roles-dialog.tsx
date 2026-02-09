'use client'

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
import { rolesApi } from '@/lib/api/roles'
import { usersApi } from '@/lib/api/users'
import type { Role, User } from '@/types'

interface UserRolesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSaved: () => void
}

export function UserRolesDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: UserRolesDialogProps) {
  const [allRoles, setAllRoles] = useState<Role[]>([])
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return

    setLoading(true)
    Promise.all([rolesApi.list(1, 100), usersApi.get(user.id)])
      .then(([rolesRes, freshUser]) => {
        setAllRoles(rolesRes.items)
        setAssignedIds(
          new Set(freshUser.userRoles?.map((ur) => ur.role.id) ?? []),
        )
      })
      .finally(() => setLoading(false))
  }, [open, user])

  const toggle = async (roleId: string) => {
    if (!user) return

    setActionLoading(roleId)
    try {
      if (assignedIds.has(roleId)) {
        await usersApi.removeRole(user.id, roleId)
        setAssignedIds((prev) => {
          const next = new Set(prev)

          next.delete(roleId)

          return next
        })
        toaster.success({ title: 'Role removed' })
      } else {
        await usersApi.assignRole(user.id, roleId)
        setAssignedIds((prev) => new Set(prev).add(roleId))
        toaster.success({ title: 'Role assigned' })
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
          <DialogTitle>Manage Roles for {user?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {loading ? (
            <Flex justify={'center'} py={'4'}>
              <Spinner />
            </Flex>
          ) : (
            <Stack gap={'2'}>
              {allRoles.map((role) => (
                <Flex key={role.id} align={'center'} justify={'space-between'}>
                  <Flex align={'center'} gap={'2'}>
                    <Text fontWeight={'medium'}>{role.name}</Text>
                    {assignedIds.has(role.id) && (
                      <Badge colorPalette={'green'} size={'sm'}>
                        Assigned
                      </Badge>
                    )}
                  </Flex>
                  <Button
                    size={'sm'}
                    variant={assignedIds.has(role.id) ? 'outline' : 'solid'}
                    colorPalette={assignedIds.has(role.id) ? 'red' : 'blue'}
                    onClick={() => toggle(role.id)}
                    loading={actionLoading === role.id}
                  >
                    {assignedIds.has(role.id) ? 'Remove' : 'Assign'}
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
