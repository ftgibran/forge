import { LuUsers } from 'react-icons/lu'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { StatCard } from './StatCard'

vi.mock('@app/theme', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()

  return {
    ...original,
    StatRoot: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid={'stat-root'}>{children}</div>
    ),
    StatLabel: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid={'stat-label'}>{children}</div>
    ),
    StatValueText: ({ value }: { value: number }) => (
      <div data-testid={'stat-value'}>{String(value)}</div>
    ),
  }
})

describe('StatCard', () => {
  it('renders the label', () => {
    render(<StatCard label={'Total Users'} value={42} icon={LuUsers} />)
    expect(screen.getByTestId('stat-label')).toHaveTextContent('Total Users')
  })

  it('renders the value', () => {
    render(<StatCard label={'Total Users'} value={42} icon={LuUsers} />)
    expect(screen.getByTestId('stat-value')).toHaveTextContent('42')
  })

  it('renders 0 value correctly', () => {
    render(<StatCard label={'New Users'} value={0} icon={LuUsers} />)
    expect(screen.getByTestId('stat-value')).toHaveTextContent('0')
  })
})
