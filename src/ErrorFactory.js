/**
 * ErrorFactory class module.
 *
 * @module ErrorFactory
 */

import BaseError from "./BaseError.js";




/** Creates errors to be thrown in the application. */
export default class ErrorFactory {

  constructor(appContext) {
    this._appCtx = appContext;
  }

  forIncorrectSetupData(message) {
    return this.createBaseErrorFor(`Incorrect setup data: ${message}`);
  }

  forIncorrectSetup(message) {
    return this.createBaseErrorFor(`Incorrect setup: ${message}`);
  }

  forModelViolation(message) {
    return this.createBaseErrorFor(`Model violation: ${message}`);
  }

  createBaseErrorFor(message) {
    return new BaseError(message, this._appCtx);
  }

}
