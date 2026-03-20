'use client'

import type { Review } from '@app/sdk'
import { useDeleteReview, useProductReviews, useProducts } from '@app/sdk'
import { formatDate } from '@app/utils'
import { HStack, IconButton, Input } from '@chakra-ui/react'
import { Box, Table, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuEye, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { PageHeader } from '@/components/page-header'
import { ReviewDetailDialog } from '@/components/reviews/review-detail-dialog'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'

export default function ReviewsPage() {
  const t = useTranslations('reviews')
  const tc = useTranslations('common')

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  )

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailReviewId, setDetailReviewId] = useState<string | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)

  const { data: productsData } = useProducts({ limit: 100 })

  const products = productsData?.items ?? []
  const effectiveProductId =
    selectedProductId ?? productsData?.items[0]?.id ?? null

  const { data: reviewsData, isLoading: loading } = useProductReviews(
    effectiveProductId ?? '',
    1,
    50,
  )

  const reviews = reviewsData?.items ?? []

  const deleteMutation = useDeleteReview()

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toaster.success({ title: t('reviewDeleted') })
        setDeleteOpen(false)
      },
      onError: () => {
        toaster.error({ title: tc('deleteFailed') })
      },
    })
  }

  return (
    <>
      <PageHeader title={t('title')} />

      <Box mb={'4'}>
        <Text fontSize={'sm'} mb={'2'} fontWeight={'medium'}>
          {t('selectProduct')}
        </Text>
        <Input
          as={'select'}
          size={'sm'}
          maxW={'400px'}
          value={effectiveProductId ?? ''}
          onChange={(e) => setSelectedProductId(e.target.value || null)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Input>
      </Box>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : reviews.length === 0 ? (
        <Text color={'fg.muted'}>{t('noReviews')}</Text>
      ) : (
        <Table.Root size={'sm'} variant={'outline'} interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('user')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('rating')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('reviewTitle')}</Table.ColumnHeader>
              <Table.ColumnHeader>{tc('created')}</Table.ColumnHeader>
              <Table.ColumnHeader>{tc('actions')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {reviews.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell fontWeight={'medium'}>
                  {r.user?.name ?? '-'}
                </Table.Cell>
                <Table.Cell>
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </Table.Cell>
                <Table.Cell>{r.title ?? '-'}</Table.Cell>
                <Table.Cell color={'fg.muted'}>
                  {formatDate(r.createdAt)}
                </Table.Cell>
                <Table.Cell>
                  <HStack gap={'1'}>
                    <IconButton
                      aria-label={t('view')}
                      size={'xs'}
                      variant={'ghost'}
                      onClick={() => {
                        setDetailReviewId(r.id)
                        setDetailOpen(true)
                      }}
                    >
                      <LuEye />
                    </IconButton>
                    <IconButton
                      aria-label={tc('delete')}
                      size={'xs'}
                      variant={'ghost'}
                      colorPalette={'red'}
                      onClick={() => {
                        setDeleteTarget(r)
                        setDeleteOpen(true)
                      }}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      <ReviewDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        reviewId={detailReviewId}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteReview')}
        description={t('deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
