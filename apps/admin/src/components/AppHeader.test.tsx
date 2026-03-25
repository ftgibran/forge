import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { AppHeader } from './AppHeader'

vi.mock('@app/sdk', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { id: '1', name: 'Admin User', email: 'admin@test.com' },
    logout: vi.fn(),
  })),
}))

vi.mock('@/components/LocaleSwitcher', () => ({
  LocaleSwitcher: () => null,
}))

vi.mock('@app/theme', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()

  return {
    ...original,
    Avatar: ({ name }: { name?: string }) => (
      <div data-testid={'avatar'}>{name}</div>
    ),
    ColorModeButton: () => null,
    MenuRoot: ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    ),
    MenuTrigger: ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    ),
    MenuContent: ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    ),
    MenuItem: ({
      children,
      onClick,
    }: {
      children?: React.ReactNode
      onClick?: () => void
    }) => <div onClick={onClick}>{children}</div>,
  }
})

describe('AppHeader', () => {
  it('renders the user avatar with name', () => {
    render(<AppHeader />)
    expect(screen.getByTestId('avatar')).toHaveTextContent('Admin User')
  })

  it('renders user name in menu', () => {
    render(<AppHeader />)
    expect(screen.getAllByText('Admin User').length).toBeGreaterThanOrEqual(1)
  })

  it('renders user email in menu', () => {
    render(<AppHeader />)
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
  })
})
