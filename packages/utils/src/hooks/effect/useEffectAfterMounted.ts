import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * Runs an effect only after the component has mounted, skipping the initial render.
 * Useful when you want to react to dependency changes but not on first mount.
 */
export const useEffectAfterMounted = (
  effect: EffectCallback,
  deps: DependencyList,
) => {
  const onReset = useRef<() => void>(null)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isMounted) {
      const current = effect()

      if (current) {
        onReset.current = current
      }
    } else {
      setIsMounted(true)
    }

    return () => {
      onReset.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
