/**
 * String-related utility functions.
 *
 * @module StringUtils
 */




/**
 * Appends a period to a string in case the string
 * does not already end with one.
 *
 * @param {string} s - The string to check for the ending period.
 * @return {string} The given string with a period appended if necessary.
 */
 export function ensureThatEndsWithPeriod(s) {
  return !s.endsWith(".") ? s + "." : s;
}


/**
 * Checks if an argument is a non-empty string. That is,
 * the string must contain at least one non-whitespace character.
 *
 * @param {string} s - The string to check.
 * @return {boolean} True if the argument is a non-empty string; false otherwise.
 */
 export function isNonEmptyString(s) {
  return $.type(s) === "string" && $.trim(s).length > 0;
}
