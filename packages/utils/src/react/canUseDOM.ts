/**
 * A boolean variable that determines if the DOM (Document Object Model)
 * can be accessed and used in the current environment.
 *
 * This variable is evaluated by checking if the `window` object is defined
 * and whether it contains the `document` object with the `createElement`
 * method. It is useful for identifying environments where DOM manipulation
 * is possible, such as browsers, as opposed to non-DOM environments
 * like Node.js.
 *
 * The value will be `true` if the DOM is accessible, otherwise `false`.
 */
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
