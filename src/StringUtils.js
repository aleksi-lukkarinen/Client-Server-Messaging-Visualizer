/**
 * String-related utility functions.
 *
 * @module StringUtils
 */

/* jshint -W097 */
"use strict";




/**
 * Appends a given string to another string in case the latter
 * does not already end with the former.
 *
 * @param {string} s - The string to check for the desired ending.
 * @param (string) ending - The desired ending of the string s.
 * @return {string} The given string with a period appended if necessary.
 */
export function ensureThatEndsWith(s, ending) {
  return !s.endsWith(ending) ? s + ending : s;
}


/**
 * Appends a period to a string in case the string
 * does not already end with one.
 *
 * @param {string} s - The string to check for the ending period.
 * @return {string} The given string with a period appended if necessary.
 */
export function ensureThatEndsWithPeriod(s) {
  return ensureThatEndsWith(s, ".");
}


/**
 * Appends a space (ASCII 32) to a string in case the string
 * does not already end with one.
 *
 * @param {string} s - The string to check for the ending space.
 * @return {string} The given string with a soace appended if necessary.
 */
export function ensureThatEndsWithSpace(s) {
  return ensureThatEndsWith(s, " ");
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
