/**
 * Safe HTML templating.
 *
 * React auto-escapes every value interpolated into JSX; a hand-written HTML
 * string built with plain template literals does NOT, so this is the one
 * thing standing between "moved off React" and reintroducing XSS on every
 * page that renders content from the database (enquiries, staff names,
 * booking details — all ultimately user-supplied).
 *
 * Use the `html` tagged template for every page/fragment. Any value you
 * interpolate is escaped automatically, UNLESS it is wrapped in `raw()` —
 * which you should only ever call with a string YOU wrote (a nested `html`
 * result, a hard-coded SVG, etc.), never with anything derived from user or
 * database input.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c])
}

class SafeString {
  constructor(value) {
    this.value = value
  }
  toString() {
    return this.value
  }
}

/** Marks a string as already-safe HTML — bypasses escaping. Use sparingly and only with trusted input. */
export function raw(value) {
  return new SafeString(value ?? '')
}

function stringify(value) {
  if (value == null || value === false) return ''
  if (value instanceof SafeString) return value.value
  if (Array.isArray(value)) return value.map(stringify).join('')
  return escapeHtml(value)
}

/** Tagged template: `` html`<p>${userText}</p>` `` — interpolations are escaped unless wrapped in `raw()`. */
export function html(strings, ...values) {
  let out = strings[0]
  for (let i = 0; i < values.length; i++) {
    out += stringify(values[i]) + strings[i + 1]
  }
  return raw(out)
}

/** Join an array of `html` fragments (or plain strings) with no separator, staying marked safe. */
export function joinHtml(fragments) {
  return raw(fragments.map(stringify).join(''))
}
