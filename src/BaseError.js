/**
 * BaseError class module.
 *
 * @module BaseError
 */

/* jshint -W097 */
"use strict";

import * as Config from "./Config.js";




/** Represents the root of the error class hierarchy. */
export default function BaseError(message, appContext) {
  this._appCtx = appContext;
  this.message = this.formatErrorMessage(message);
}

BaseError.prototype = new Error();

BaseError.prototype.formatErrorMessage = 
        function(message, AC = this._appCtx) {

  return AC.stringUtils.ensureThatEndsWithPeriod(
    `${Config.application.NAME}: ${message}`);
};
