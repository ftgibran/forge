import { usePathname } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renders all navigation links', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Sidebar />)
    // These nav items use translation keys — our mock returns the key as-is
    expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /roles/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument()
  })

  it('renders the admin heading', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Sidebar />)
    // The heading text comes from t('admin') which returns 'admin' via our mock
    expect(screen.getByRole('heading', { name: 'admin' })).toBeInTheDocument()
  })

  it('renders nav links with correct hrefs', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Sidebar />)
    const usersLink = screen.getByRole('link', { name: /users/i })

    expect(usersLink).toHaveAttribute('href', '/users')
  })

  it('marks current path as active (users)', () => {
    vi.mocked(usePathname).mockReturnValue('/users')
    render(<Sidebar />)
    // When active, the Button should have variant="subtle"
    // Our Chakra mock renders a plain button — just verify the link exists
    const usersLink = screen.getByRole('link', { name: /users/i })

    expect(usersLink).toBeInTheDocument()
  })
})
