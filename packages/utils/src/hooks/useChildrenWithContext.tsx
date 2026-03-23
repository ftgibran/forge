import React, { FC, ReactNode, useMemo } from 'react'

import { findElementByName } from '../react'
import { getValidElements } from '../react'

export type ChildrenWithContext<T> = ReactNode | ((context: T) => ReactNode)

/**
 * Resolves children that may be a `ReactNode` or a render function `(context: T) => ReactNode`.
 * When children is a function, it is called with the provided context.
 * When a `ContainerFallback` component is given and no matching element is found in children, wraps children in it.
 */
export function useChildrenWithContext<T>(
  children: ChildrenWithContext<T>,
  context: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ContainerFallback?: FC<any>,
) {
  return useMemo(() => {
    if (children instanceof Function) {
      return children(context)
    }

    if (ContainerFallback) {
      const { displayName } = ContainerFallback

      if (displayName) {
        const el = findElementByName(getValidElements(children), displayName)

        if (el) {
          return children
        }
      }

      return <ContainerFallback>{children}</ContainerFallback>
    }

    return children
  }, [ContainerFallback, children, context])
}
