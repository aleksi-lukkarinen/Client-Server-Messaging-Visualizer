/**
 * BaseError class module.
 *
 * @module BaseError
 */

/* jshint -W097 */
"use strict";

import * as Config from "./Config.js";
import * as StringUtils from "./StringUtils.js";




/** Represents the root of the error class hierarchy. */
export default function BaseError(message) {
  this.message = this.formatErrorMessage(message);
}

BaseError.prototype = new Error();

BaseError.prototype.formatErrorMessage = function(message) {
  return StringUtils.ensureThatEndsWithPeriod(
            `${Config.application.NAME}: ${message}`);
};
