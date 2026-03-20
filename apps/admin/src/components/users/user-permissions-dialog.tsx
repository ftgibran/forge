'use client'

import type { Permission, User } from '@app/sdk'
import {
  useAssignUserPermission,
  usePermissions,
  useRemoveUserPermission,
  useUser,
} from '@app/sdk'
import { formatPermission } from '@app/utils'
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
  const t = useTranslations('users')
  const tc = useTranslations('common')
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: permsData, isLoading } = usePermissions(1, 100, {
    enabled: open,
  })
  const { data: freshUser } = useUser(user?.id ?? '', {
    enabled: open && !!user?.id,
  })

  const allPermissions: Permission[] = permsData?.items ?? []

  const assignPermission = useAssignUserPermission()
  const removePermission = useRemoveUserPermission()

  useEffect(() => {
    if (freshUser) {
      setAssignedIds(
        new Set(freshUser.userPermissions?.map((up) => up.permission.id) ?? []),
      )
    }
  }, [freshUser])

  const toggle = (permissionId: string) => {
    if (!user) return

    setActionLoading(permissionId)

    if (assignedIds.has(permissionId)) {
      removePermission.mutate(
        { userId: user.id, permissionId },
        {
          onSuccess: () => {
            setAssignedIds((prev) => {
              const next = new Set(prev)

              next.delete(permissionId)

              return next
            })
            toaster.success({ title: t('permissionRemoved') })
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('operationFailed') })
          },
          onSettled: () => setActionLoading(null),
        },
      )
    } else {
      assignPermission.mutate(
        { userId: user.id, permissionId },
        {
          onSuccess: () => {
            setAssignedIds((prev) => new Set(prev).add(permissionId))
            toaster.success({ title: t('permissionAssigned') })
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
            {t('directPermissions', { name: user?.name ?? '' })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {isLoading ? (
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
                        {tc('assigned')}
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
                    {assignedIds.has(perm.id) ? tc('remove') : tc('assign')}
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
