'use client'

import type { VendorApplication } from '@app/sdk'
import { useGetVendorApplications, useReviewVendorApplication } from '@app/sdk'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@app/theme'
import { toaster } from '@app/theme'
import { formatDate } from '@app/utils'
import { Badge, Button, HStack, Table, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

interface VendorApplicationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewed: () => void
}

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
}

export function VendorApplicationsDialog({
  open,
  onOpenChange,
  onReviewed,
}: VendorApplicationsDialogProps) {
  const t = useTranslations('vendors')
  const tc = useTranslations('common')

  const { data, isLoading } = useGetVendorApplications(
    { page: 1, limit: 50 },
    { query: { enabled: open } },
  )
  const applications = (data?.items ?? []) as unknown as VendorApplication[]

  const reviewApplication = useReviewVendorApplication()

  const handleReview = (id: string, status: 'APPROVED' | 'REJECTED') => {
    reviewApplication.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toaster.success({ title: `Application ${status.toLowerCase()}` })
          onReviewed()
        },
        onError: () => {
          toaster.error({ title: t('reviewFailed') })
        },
      },
    )
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size={'xl'}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('vendorApplications')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {isLoading ? (
            <Text>{tc('loading')}</Text>
          ) : applications.length === 0 ? (
            <Text color={'fg.muted'}>{t('noApplications')}</Text>
          ) : (
            <Table.Root size={'sm'} variant={'outline'}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>{t('vendor')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('message')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{tc('status')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('date')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{tc('actions')}</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {applications.map((app) => (
                  <Table.Row key={app.id}>
                    <Table.Cell fontWeight={'medium'}>
                      {app.vendor?.name}
                    </Table.Cell>
                    <Table.Cell maxW={'200px'} truncate>
                      {app.message}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={statusColor[app.status]} size={'sm'}>
                        {app.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell color={'fg.muted'}>
                      {formatDate(app.createdAt)}
                    </Table.Cell>
                    <Table.Cell>
                      {app.status === 'PENDING' && (
                        <HStack gap={'1'}>
                          <Button
                            size={'xs'}
                            colorPalette={'green'}
                            onClick={() => handleReview(app.id, 'APPROVED')}
                          >
                            {t('approve')}
                          </Button>
                          <Button
                            size={'xs'}
                            colorPalette={'red'}
                            variant={'outline'}
                            onClick={() => handleReview(app.id, 'REJECTED')}
                          >
                            {t('reject')}
                          </Button>
                        </HStack>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
