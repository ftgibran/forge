import { Children, Fragment, isValidElement, type ReactNode } from 'react'

/**
 * Determines whether the provided ReactNode is a child of a React Fragment.
 *
 * This utility function takes a single ReactNode and attempts to identify
 * if it is encapsulated within a React Fragment. It ensures that the component
 * is a valid React element and safely handles cases where multiple children
 * or invalid nodes may be passed.
 */
export const isFragmentChild = (children: ReactNode) => {
  try {
    const node = Children.only(children)

    return isValidElement(node) ? node.type === Fragment : false
  } catch {
    return false
  }
}
