'use client'

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@app/theme'
import { Box, HStack, Table } from '@chakra-ui/react'

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <Box>
      <Table.Root size={'sm'} variant={'outline'} interactive>
        <Table.Header>
          <Table.Row>
            {columns.map((col, i) => (
              <Table.ColumnHeader key={i}>{col.header}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row) => (
            <Table.Row key={row.id}>
              {columns.map((col, i) => (
                <Table.Cell key={i}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {total > limit && (
        <HStack mt={'4'} justify={'center'}>
          <PaginationRoot
            count={total}
            pageSize={limit}
            page={page}
            onPageChange={(e) => onPageChange(e.page)}
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </HStack>
      )}
    </Box>
  )
}
