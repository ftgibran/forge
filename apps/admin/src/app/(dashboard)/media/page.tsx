'use client'

import type { MediaDto } from '@app/sdk'
import { useDeleteMedia, useGetMediaList } from '@app/sdk'
import { toaster } from '@app/theme'
import { formatDate } from '@app/utils'
import { Box, Button, HStack, IconButton, Image, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DataTable } from '@/components/DataTable'
import { MediaEditDialog } from '@/components/media/MediaEditDialog'
import { MediaUploadDialog } from '@/components/media/MediaUploadDialog'
import { PageHeader } from '@/components/PageHeader'
import { TableSkeleton } from '@/components/TableSkeleton'

export default function MediaPage() {
  const t = useTranslations('media')
  const tc = useTranslations('common')

  const [page, setPage] = useState(1)

  const [uploadOpen, setUploadOpen] = useState(false)

  const [editTarget, setEditTarget] = useState<MediaDto | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MediaDto | null>(null)

  const limit = 10

  const { data, isLoading } = useGetMediaList({ page, limit })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const deleteMutation = useDeleteMedia()

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toaster.success({ title: t('mediaDeleted') })
          setDeleteOpen(false)
        },
        onError: () => {
          toaster.error({ title: tc('deleteFailed') })
        },
      },
    )
  }

  const columns = [
    {
      header: t('thumbnail'),
      accessor: (m: MediaDto) =>
        m.sizes?.thumbnail?.url ? (
          <Image
            src={m.sizes.thumbnail.url}
            alt={m.alt ?? ''}
            boxSize={'10'}
            objectFit={'cover'}
            borderRadius={'md'}
          />
        ) : (
          <Box boxSize={'10'} bg={'gray.100'} borderRadius={'md'} />
        ),
    },
    {
      header: t('filename'),
      accessor: (m: MediaDto) => (
        <Text fontSize={'sm'} maxW={'48'} truncate>
          {m.filename ?? t('noAlt')}
        </Text>
      ),
    },
    {
      header: t('altText'),
      accessor: (m: MediaDto) => m.alt ?? t('noAlt'),
    },
    {
      header: t('dimensions'),
      accessor: (m: MediaDto) =>
        m.width && m.height ? `${m.width}×${m.height}` : t('noAlt'),
    },
    {
      header: t('fileSize'),
      accessor: (m: MediaDto) =>
        m.filesize ? `${Math.round(m.filesize / 1024)} KB` : t('noAlt'),
    },
    {
      header: tc('created'),
      accessor: (m: MediaDto) => formatDate(m.createdAt),
    },
    {
      header: tc('actions'),
      accessor: (m: MediaDto) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={tc('edit')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setEditTarget(m)
              setEditOpen(true)
            }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label={tc('delete')}
            size={'xs'}
            variant={'ghost'}
            colorPalette={'red'}
            onClick={() => {
              setDeleteTarget(m)
              setDeleteOpen(true)
            }}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      ),
    },
  ]

  return (
    <>
      <PageHeader title={t('title')}>
        <Button
          colorPalette={'blue'}
          size={'sm'}
          onClick={() => setUploadOpen(true)}
        >
          <LuPlus />
          {t('uploadMedia')}
        </Button>
      </PageHeader>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <MediaUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSaved={() => setUploadOpen(false)}
      />

      <MediaEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        media={editTarget}
        onSaved={() => setEditOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteMedia')}
        description={tc('deleteConfirm', {
          name: deleteTarget?.filename ?? '',
        })}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
