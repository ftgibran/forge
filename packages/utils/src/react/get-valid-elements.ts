import { Children, isValidElement, type ReactNode } from 'react'

import type { ValidElement } from '../types/valid-element'

/**
 * Filters and returns only the valid React elements from the provided children.
 *
 * This function takes React children, converts them into an array of child nodes,
 * and filters the nodes to return only those that are valid React elements.
 */
export const getValidElements = (children: ReactNode) => {
  const nodes = Children.toArray(children)

  return nodes.filter((node) => isValidElement(node)) as ValidElement[]
}
