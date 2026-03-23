import { useCallback, useEffect, useState } from 'react'

/**
 * Returns an `emit` function that defers invoking the given callback via state.
 * Useful for triggering side effects from event handlers without calling the callback directly in render.
 * Defaults the payload to `true` when `emit` is called with no argument.
 */
export function useLazyEvent<T = boolean>(callback?: (payload: T) => void) {
  const [payload, setPayload] = useState<T>()

  const emit = useCallback((payload?: T) => {
    setPayload(payload ?? (true as unknown as T))
  }, [])

  useEffect(() => {
    if (payload) {
      callback?.(payload)

      setPayload(undefined)
    }
  }, [callback, payload])

  return emit
}
