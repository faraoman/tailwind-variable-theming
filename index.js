/** @typedef {import('./types/types').RecursiveKeyValuePairs} RecursiveKeyValuePairs */
/** @typedef {import('./types/types').KeyValuePairs} KeyValuePairs */
/** @typedef {import('./types/types').ThemeOptions} ThemeOptions */
/** @typedef {({ addUtilities: (utilities: RecursiveKeyValuePairs) => void })} TailwindPluginOptions */

/**
 * Create a theme.
 * @param {ThemeOptions} definitions
 */

function createTheme(definitions) {
  const name = definitions.name || 'default'

  // Configuration for Tailwind
  const config = {
    colors: toConfig(definitions.colors || {}),
  }

  // CSS variables
  const vars = {
    ...toVars(definitions.colors || {}),
  }

  // Tailwind plugin
  const plugin = (/** @type {TailwindPluginOptions} */ { addUtilities }) => {
    addUtilities({ [`.theme-${name}`]: vars })
  }

  return { config, vars, plugin }
}

/**
 * Convert to Tailwind configuration
 * @param {RecursiveKeyValuePairs} colors
 * @param {string} prefix
 * @return {RecursiveKeyValuePairs}
 */

function toConfig(colors, prefix = '') {
  /** @type {RecursiveKeyValuePairs} */
  const result = {}

  for (let [key, value] of Object.entries(colors)) {
    if (typeof value === 'object') {
      result[key] = toConfig(value, `${prefix}${key}-`)
    } else {
      const varName = '--' + kebabCase(`${prefix}${key}`)
      result[key] = `var(${varName})`
    }
  }

  return result
}

/**
 * @param {RecursiveKeyValuePairs} colors
 * @param {string} prefix
 * @return {KeyValuePairs}
 */

function toVars(colors, prefix = '') {
  /** @type {KeyValuePairs} */
  const result = {}

  for (let [key, value] of Object.entries(colors)) {
    if (typeof value === 'object') {
      Object.assign(result, toVars(value, `${prefix}${key}-`))
    } else {
      result['--' + kebabCase(`${prefix}${key}`)] = value
    }
  }

  return result
}

module.exports = { createTheme }

/** @param {string} str */
function kebabCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}
