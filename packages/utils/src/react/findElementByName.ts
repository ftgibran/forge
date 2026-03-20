import type { ValidElement } from '../types/ValidElement'
import { getValidElements } from './getValidElements'

/**
 * Searches through an array of elements to find an element with a matching `displayName`.
 * The search can descend into the children of elements if the `deep` parameter is greater than 0.
 */
export const findElementByName = (
  elements: ValidElement[],
  displayName: string,
  deep = 1,
): ValidElement | undefined => {
  for (const el of elements) {
    if (el.type.displayName === displayName) {
      return el
    }
  }

  for (const el of elements) {
    const children = getValidElements(el.props.children)

    if (children.length && deep > 0) {
      return findElementByName(children, displayName, deep - 1)
    }
  }

  return undefined
}
