import { describe, expect, it } from 'vitest'

import { formatDate } from './format-date'
import {
  displayPermission,
  formatPermission,
  parsePermission,
} from './format-permission'

describe('formatDate', () => {
  it('formats a Date object with default formatter', () => {
    const date = new Date('2024-01-15T10:30:00.000Z')
    const result = formatDate(date)

    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/15/)
  })

  it('formats a date string with default formatter', () => {
    const result = formatDate('2024-06-20T00:00:00.000Z')

    expect(result).toMatch(/Jun/)
    expect(result).toMatch(/2024/)
  })

  it('uses a custom formatter when provided', () => {
    const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric' })
    const result = formatDate('2024-06-15T12:00:00.000Z', formatter)

    expect(result).toBe('2024')
  })

  it('handles a Date at epoch', () => {
    const result = formatDate(new Date(0))

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatPermission', () => {
  it('joins action and resource with a colon', () => {
    expect(formatPermission('read', 'user')).toBe('read:user')
  })

  it('works with multi-word resource', () => {
    expect(formatPermission('create', 'product-image')).toBe(
      'create:product-image',
    )
  })

  it('works with empty strings', () => {
    expect(formatPermission('', '')).toBe(':')
  })
})

describe('parsePermission', () => {
  it('splits a simple action:resource string', () => {
    expect(parsePermission('read:user')).toEqual({
      action: 'read',
      resource: 'user',
    })
  })

  it('handles resource with colons by keeping remainder', () => {
    expect(parsePermission('read:some:resource')).toEqual({
      action: 'read',
      resource: 'some:resource',
    })
  })

  it('handles a string with no colon', () => {
    const result = parsePermission('read')

    expect(result.action).toBe('read')
    expect(result.resource).toBe('')
  })

  it('handles empty string', () => {
    const result = parsePermission(':')

    expect(result.action).toBe('')
    expect(result.resource).toBe('')
  })
})

describe('displayPermission', () => {
  it('capitalizes action and resource', () => {
    expect(displayPermission('read:user')).toBe('Read User')
  })

  it('capitalizes action only when resource is empty', () => {
    expect(displayPermission('read:')).toBe('Read ')
  })

  it('handles multi-word resource (capitalizes first letter only)', () => {
    expect(displayPermission('create:product-image')).toBe(
      'Create Product-image',
    )
  })
})
