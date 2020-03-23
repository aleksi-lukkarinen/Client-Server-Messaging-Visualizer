/**
 * StringUtils class module.
 *
 * @module StringUtils
 */




/** Provides utility functions for handling strings. */
export default class StringUtils {

  /* eslint class-methods-use-this: "off" */

  /**
   * Appends a given string to another string in case the latter
   * does not already end with the former.
   *
   * @param {string} [s] - The string to check for the desired ending.
   * @param {string} [ending] - The desired ending of the string s.
   * @return {string} The given string with a period appended if necessary.
   */
  ensureThatEndsWith(s, ending) {
    return s.endsWith(ending) ? s : s + ending;
  }


  /**
   * Appends a period to a string in case the string
   * does not already end with one.
   *
   * @param {string} [s] - The string to check for the ending period.
   * @return {string} The given string with a period appended if necessary.
   */
  ensureThatEndsWithPeriod(s) {
    return this.ensureThatEndsWith(s, ".");
  }


  /**
   * Appends a space (ASCII 32) to a string in case the string
   * does not already end with one.
   *
   * @param {string} [s] - The string to check for the ending space.
   * @return {string} The given string with a soace appended if necessary.
   */
  ensureThatEndsWithSpace(s) {
    return this.ensureThatEndsWith(s, " ");
  }


  /**
   * Checks if an argument is a non-empty string. That is,
   * the string must contain at least one non-whitespace character.
   *
   * @param {string} [s] - The string to check.
   * @return {boolean} True if the argument is a non-empty string; false otherwise.
   */
  isNonEmptyString(s) {
    return this.isPrimitiveString(s) && $.trim(s).length > 0;
  }


  /**
   * Checks if the type of an argument is that of the primitive string.
   *
   * @param {string} [s] - The value to check.
   * @return {boolean} True if the argument is a primitive string; false otherwise.
   */
  isPrimitiveString(s) {
    return $.type(s) === "string";
  }

}
