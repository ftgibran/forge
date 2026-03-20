import React, { FC, ReactNode, useMemo } from 'react'
import { getValidElements } from '../react/getValidElements'
import { findElementByName } from '../react/findElementByName'

export type ChildrenWithContext<T> = ReactNode | ((context: T) => ReactNode)

/**
 * Processes children with a given context, either utilizing a context-based function or falling back to a container component.
 */
export function useChildrenWithContext<T>(
  children: ChildrenWithContext<T>,
  context: T,
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
