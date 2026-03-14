'use client'

import { formatDate } from '@app/utils'
import { HStack, IconButton, Input } from '@chakra-ui/react'
import { Box, Table, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { LuEye, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { PageHeader } from '@/components/page-header'
import { ReviewDetailDialog } from '@/components/reviews/review-detail-dialog'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { productsApi } from '@/lib/api/products'
import { reviewsApi } from '@/lib/api/reviews'
import type { Product, Review } from '@/types'

export default function ReviewsPage() {
  const t = useTranslations('reviews')
  const tc = useTranslations('common')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  )
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailReviewId, setDetailReviewId] = useState<string | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    productsApi
      .list({ limit: 100 })
      .then((r) => {
        setProducts(r.items)

        if (r.items.length > 0) {
          setSelectedProductId(r.items[0].id)
        }
      })
      .catch(() => toaster.error({ title: t('loadProductsFailed') }))
      .finally(() => setLoading(false))
  }, [t])

  const fetchReviews = useCallback(async () => {
    if (!selectedProductId) return

    setLoading(true)
    try {
      const res = await reviewsApi.listByProduct(selectedProductId, 1, 50)

      setReviews(res.items)
    } catch {
      toaster.error({ title: t('loadFailed') })
    } finally {
      setLoading(false)
    }
  }, [selectedProductId, t])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await reviewsApi.delete(deleteTarget.id)
      toaster.success({ title: t('reviewDeleted') })
      setDeleteOpen(false)
      fetchReviews()
    } catch {
      toaster.error({ title: tc('deleteFailed') })
    } finally {
      setDeleting(false)
    }
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
          value={selectedProductId ?? ''}
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
        loading={deleting}
      />
    </>
  )
}
