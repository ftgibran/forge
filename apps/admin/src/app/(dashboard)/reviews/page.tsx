'use client'

import { formatDate } from '@app/utils'
import { HStack, IconButton, Input } from '@chakra-ui/react'
import { Box, Table, Text } from '@chakra-ui/react'
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
      .catch(() => toaster.error({ title: 'Failed to load products' }))
      .finally(() => setLoading(false))
  }, [])

  const fetchReviews = useCallback(async () => {
    if (!selectedProductId) return

    setLoading(true)
    try {
      const res = await reviewsApi.listByProduct(selectedProductId, 1, 50)

      setReviews(res.items)
    } catch {
      toaster.error({ title: 'Failed to load reviews' })
    } finally {
      setLoading(false)
    }
  }, [selectedProductId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await reviewsApi.delete(deleteTarget.id)
      toaster.success({ title: 'Review deleted' })
      setDeleteOpen(false)
      fetchReviews()
    } catch {
      toaster.error({ title: 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader title={'Reviews'} />

      <Box mb={'4'}>
        <Text fontSize={'sm'} mb={'2'} fontWeight={'medium'}>
          Select Product:
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
        <Text color={'fg.muted'}>No reviews for this product.</Text>
      ) : (
        <Table.Root size={'sm'} variant={'outline'} interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>User</Table.ColumnHeader>
              <Table.ColumnHeader>Rating</Table.ColumnHeader>
              <Table.ColumnHeader>Title</Table.ColumnHeader>
              <Table.ColumnHeader>Created</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
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
                      aria-label={'View'}
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
                      aria-label={'Delete'}
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
        title={'Delete Review'}
        description={
          'Are you sure you want to delete this review? This action cannot be undone.'
        }
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
