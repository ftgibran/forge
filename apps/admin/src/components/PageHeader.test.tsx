import { describe, expect, it } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title={'Users'} />)
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
  })

  it('renders children alongside the title', () => {
    render(
      <PageHeader title={'Users'}>
        <button>Add User</button>
      </PageHeader>,
    )
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument()
  })

  it('renders without children', () => {
    render(<PageHeader title={'Dashboard'} />)
    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
  })
})
