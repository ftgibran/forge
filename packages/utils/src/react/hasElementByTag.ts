/**
 * Checks if the given element or its ancestors (up to a specified depth) match any of the provided tag names.
 */
export function hasElementByTag(
  el: Element | null | undefined,
  deep: number,
  ...tags: string[]
): boolean {
  if (!el) {
    return false
  }

  if (tags.includes(el.tagName)) {
    return true
  }

  if (deep > 0) {
    return hasElementByTag(el.parentElement, deep - 1, ...tags)
  }

  return false
}
