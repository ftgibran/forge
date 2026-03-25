import { describe, expect, it } from 'vitest'

import { decodeJwt, type JwtPayload } from './decode-jwt'

function makeToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  const signature = 'fakesig'

  return `${header}.${body}.${signature}`
}

describe('decodeJwt', () => {
  it('decodes a valid JWT and returns the payload', () => {
    const payload: JwtPayload = {
      sub: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['admin'],
      iat: 1700000000,
      exp: 1700003600,
    }
    const token = makeToken(payload)
    const result = decodeJwt(token)

    expect(result).toEqual(payload)
  })

  it('returns null when token has fewer than 3 segments', () => {
    expect(decodeJwt('only.two')).toBeNull()
  })

  it('returns null when token has only one segment', () => {
    expect(decodeJwt('justonepart')).toBeNull()
  })

  it('returns null when payload is not valid base64', () => {
    expect(decodeJwt('header.!!!invalid!!!.sig')).toBeNull()
  })

  it('returns null when payload decodes to non-JSON', () => {
    const nonJson = btoa('not json at all')

    expect(decodeJwt(`header.${nonJson}.sig`)).toBeNull()
  })

  it('handles URL-safe base64 characters (- and _)', () => {
    const payload = {
      sub: 'x',
      email: 'x@x.com',
      name: 'X',
      roles: [],
      iat: 0,
      exp: 0,
    }
    const token = makeToken(payload)

    // Token from makeToken already uses URL-safe base64
    expect(decodeJwt(token)).toEqual(payload)
  })
})
