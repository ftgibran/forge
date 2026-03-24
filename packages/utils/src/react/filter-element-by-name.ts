import type { ValidElement } from '../types'
import { getValidElements } from './get-valid-elements'

/**
 * Filters an array of elements by their `displayName` property. Searches through
 * child elements recursively up to a specified depth if no matches are found
 * in the initial array.
 */
export const filterElementByName = (
  elements: ValidElement[],
  displayName: string,
  deep = 1,
): ValidElement[] => {
  const els = elements.filter((el) => el.type.displayName === displayName)

  if (els.length !== 0) {
    return els
  }

  for (const el of elements) {
    const children = getValidElements(el.props.children)

    if (children.length && deep > 0) {
      return filterElementByName(children, displayName, deep - 1)
    }
  }

  return []
}
