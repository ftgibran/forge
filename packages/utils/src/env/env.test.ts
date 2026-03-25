import { describe, expect, it } from 'vitest'

import {
  getEnvBoolean,
  getEnvNumber,
  getEnvNumberArray,
  getEnvString,
  getEnvStringArray,
} from './env'

describe('getEnvString', () => {
  it('returns the env value when defined', () => {
    expect(getEnvString('hello')).toBe('hello')
  })

  it('returns fallback when env is undefined', () => {
    expect(getEnvString(undefined, 'default')).toBe('default')
  })

  it('returns empty string when both env and fallback are undefined', () => {
    expect(getEnvString(undefined)).toBe('')
  })

  it('returns fallback when env is empty string', () => {
    expect(getEnvString('', 'fallback')).toBe('fallback')
  })
})

describe('getEnvNumber', () => {
  it('parses a valid numeric string', () => {
    expect(getEnvNumber('42')).toBe(42)
  })

  it('returns fallback when env is undefined', () => {
    expect(getEnvNumber(undefined, 99)).toBe(99)
  })

  it('returns 0 when env is undefined and no fallback', () => {
    expect(getEnvNumber(undefined)).toBe(0)
  })

  it('returns 0 when env is not a valid number', () => {
    expect(getEnvNumber('abc')).toBe(0)
  })

  it('returns fallback when env parses to NaN', () => {
    expect(getEnvNumber('abc', 10)).toBe(10)
  })
})

describe('getEnvBoolean', () => {
  it('returns true when env is "true"', () => {
    expect(getEnvBoolean('true')).toBe(true)
  })

  it('returns false when env is "false"', () => {
    expect(getEnvBoolean('false')).toBe(false)
  })

  it('returns fallback when env is undefined and fallback is true', () => {
    expect(getEnvBoolean(undefined, true)).toBe(true)
  })

  it('returns fallback when env is undefined and fallback is false', () => {
    expect(getEnvBoolean(undefined, false)).toBe(false)
  })

  it('returns false when env is undefined and no fallback', () => {
    expect(getEnvBoolean(undefined)).toBe(false)
  })

  it('returns false for any non-"true" value', () => {
    expect(getEnvBoolean('1')).toBe(false)
    expect(getEnvBoolean('yes')).toBe(false)
    expect(getEnvBoolean('TRUE')).toBe(false)
  })
})

describe('getEnvStringArray', () => {
  it('splits a comma-separated string', () => {
    expect(getEnvStringArray('a,b,c')).toEqual(['a', 'b', 'c'])
  })

  it('returns array with single element for non-comma string', () => {
    expect(getEnvStringArray('hello')).toEqual(['hello'])
  })

  it('returns fallback split when env is undefined', () => {
    expect(getEnvStringArray(undefined, 'x,y')).toEqual(['x', 'y'])
  })

  it('returns [""] when both undefined and no fallback', () => {
    expect(getEnvStringArray(undefined)).toEqual([''])
  })
})

describe('getEnvNumberArray', () => {
  it('splits and parses a comma-separated number string', () => {
    expect(getEnvNumberArray('1,2,3')).toEqual([1, 2, 3])
  })

  it('returns fallback array when env is undefined', () => {
    expect(getEnvNumberArray(undefined, [10, 20])).toEqual([10, 20])
  })

  it('returns empty array when env is undefined and no fallback', () => {
    expect(getEnvNumberArray(undefined)).toEqual([])
  })

  it('converts non-numeric parts to 0', () => {
    expect(getEnvNumberArray('1,abc,3')).toEqual([1, 0, 3])
  })
})
