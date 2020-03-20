/**
 * ObjectUtils class module.
 *
 * @module ObjectUtils
 */




/** Provides utility functions for handling objects. */
export default class ObjectUtils {

  isBoolean(val) {
    return $.type(val) === "boolean";
  }

  /* eslint class-methods-use-this: "off", no-undefined: "off" */

  retrieveHierarchicalValue(setupData, objectPath) {
    const pathParts = objectPath.split(".");

    if (pathParts.length < 1) {
      return undefined;
    }

    let currentObject = setupData;
    for (let idx = 0; idx < pathParts.length - 1; idx++) {
      const val = currentObject[pathParts[idx]];

      if (typeof val === "undefined" || val === null) {
        return undefined;
      }

      currentObject = val;
    }

    const retVal = currentObject[pathParts[pathParts.length - 1]];
    return retVal;
  }

}
