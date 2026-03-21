'use client'

import type { Role, User } from '@app/sdk'
import {
  useAssignUserRole,
  useGetRoles,
  useGetUser,
  useRemoveUserRole,
} from '@app/sdk'
import { Badge, Button, Flex, Spinner, Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('users')
  const tc = useTranslations('common')
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: rolesData, isLoading } = useGetRoles(
    { page: 1, limit: 100 },
    { query: { enabled: open } },
  )
  const { data: freshUser } = useGetUser(user?.id ?? '', {
    query: { enabled: open && !!user?.id },
  })

  const allRoles: Role[] = rolesData?.items ?? []

  const assignRole = useAssignUserRole()
  const removeRole = useRemoveUserRole()

  useEffect(() => {
    if (freshUser) {
      setAssignedIds(
        new Set(freshUser.userRoles?.map((ur) => ur.role.id) ?? []),
      )
    }
  }, [freshUser])

  const toggle = (roleId: string) => {
    if (!user) return

    setActionLoading(roleId)

    if (assignedIds.has(roleId)) {
      removeRole.mutate(
        { id: user.id, roleId },
        {
          onSuccess: () => {
            setAssignedIds((prev) => {
              const next = new Set(prev)

              next.delete(roleId)

              return next
            })
            toaster.success({ title: t('roleRemoved') })
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('operationFailed') })
          },
          onSettled: () => setActionLoading(null),
        },
      )
    } else {
      assignRole.mutate(
        { id: user.id, data: { roleId } },
        {
          onSuccess: () => {
            setAssignedIds((prev) => new Set(prev).add(roleId))
            toaster.success({ title: t('roleAssigned') })
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('operationFailed') })
          },
          onSettled: () => setActionLoading(null),
        },
      )
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('manageRoles', { name: user?.name ?? '' })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {isLoading ? (
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
                        {tc('assigned')}
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
                    {assignedIds.has(role.id) ? tc('remove') : tc('assign')}
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
