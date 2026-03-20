import { Children, isValidElement, type ReactNode } from 'react'

import { isFragmentChild } from './isFragmentChild'

/**
 * Extracts the children from a React fragment node if the provided children is a valid React fragment.
 * If the children is not a fragment or is not a valid React element, it returns the original children.
 */
export const extractChildrenFromFragment = (children: ReactNode) => {
  if (isFragmentChild(children)) {
    const node = Children.only(children)

    if (isValidElement(node)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (node.props as any).children
    }
  }

  return children
}
