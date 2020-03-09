/**
 * ErrorFactory class module.
 *
 * @module ErrorFactory
 */

import BaseError from "./BaseError.js";




/** Creates errors to be thrown in the application. */
export default class ErrorFactory {

  static forIncorrectSetupData(message) {
    return ErrorFactory.createBaseErrorFor(`Incorrect setup data: ${message}`);
  }

  static forIncorrectSetup(message) {
    return ErrorFactory.createBaseErrorFor(`Incorrect setup: ${message}`);
  }

  static forModelViolation(message) {
    return ErrorFactory.createBaseErrorFor(`Model violation: ${message}`);
  }

  static createBaseErrorFor(message) {
    return new BaseError(message);
  }

}
