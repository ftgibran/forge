import { type EffectCallback, useEffect } from 'react'

/**
 * Runs an effect once when the component mounts.
 * Alias for `useEffect(effect, [])` with a clearer intent.
 */
export function useMountEffect(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, [])
}
