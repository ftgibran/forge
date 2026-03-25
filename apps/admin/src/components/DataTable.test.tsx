import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { DataTable } from './DataTable'

interface Row {
  id: string
  name: string
  email: string
}

const columns = [
  { header: 'Name', accessor: (row: Row) => row.name },
  { header: 'Email', accessor: (row: Row) => row.email },
]

const data: Row[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com' },
  { id: '2', name: 'Bob', email: 'bob@test.com' },
]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        total={2}
        page={1}
        limit={10}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        total={2}
        page={1}
        limit={10}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('renders with keyof accessor', () => {
    const simpleColumns = [{ header: 'Name', accessor: 'name' as keyof Row }]

    render(
      <DataTable
        columns={simpleColumns}
        data={data}
        total={2}
        page={1}
        limit={10}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('does not render pagination when total <= limit', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        total={2}
        page={1}
        limit={10}
        onPageChange={vi.fn()}
      />,
    )

    // PaginationRoot is mocked as a div — only renders when total > limit
    expect(container.querySelector('[data-pagination]')).toBeNull()
  })

  it('renders empty table with no data', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        total={0}
        page={1}
        limit={10}
        onPageChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })
})
