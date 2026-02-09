'use client'

import { useCallback, useEffect, useState } from 'react'
import { Badge, Button, HStack, Table, Text } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'
import { vendorsApi } from '@/lib/api/vendors'
import { formatDate } from '@app/utils'
import type { VendorApplication } from '@/types'

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
  const [applications, setApplications] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await vendorsApi.listApplications(1, 50)
      setApplications(res.items)
    } catch {
      toaster.error({ title: 'Failed to load applications' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetch()
  }, [open, fetch])

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await vendorsApi.reviewApplication(id, status)
      toaster.success({ title: `Application ${status.toLowerCase()}` })
      fetch()
      onReviewed()
    } catch {
      toaster.error({ title: 'Review failed' })
    }
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size='xl'
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vendor Applications</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {loading ? (
            <Text>Loading...</Text>
          ) : applications.length === 0 ? (
            <Text color='fg.muted'>No applications found.</Text>
          ) : (
            <Table.Root size='sm' variant='outline'>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Vendor</Table.ColumnHeader>
                  <Table.ColumnHeader>Message</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {applications.map((app) => (
                  <Table.Row key={app.id}>
                    <Table.Cell fontWeight='medium'>
                      {app.vendor?.name}
                    </Table.Cell>
                    <Table.Cell maxW='200px' truncate>
                      {app.message}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={statusColor[app.status]} size='sm'>
                        {app.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell color='fg.muted'>
                      {formatDate(app.createdAt)}
                    </Table.Cell>
                    <Table.Cell>
                      {app.status === 'PENDING' && (
                        <HStack gap='1'>
                          <Button
                            size='xs'
                            colorPalette='green'
                            onClick={() => handleReview(app.id, 'APPROVED')}
                          >
                            Approve
                          </Button>
                          <Button
                            size='xs'
                            colorPalette='red'
                            variant='outline'
                            onClick={() => handleReview(app.id, 'REJECTED')}
                          >
                            Reject
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
