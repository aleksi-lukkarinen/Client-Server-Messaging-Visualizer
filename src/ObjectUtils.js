/**
 * ObjectUtils class module.
 *
 * @module ObjectUtils
 */




/** Provides utility functions for handling objects. */
export default class ObjectUtils {

  retrieveHierarchicalValue(setupData, objectPath) {
    const pathParts = objectPath.split(".");

    if (pathParts.length < 1) {
      return undefined;
    }

    let currentObject = setupData;
    for (let idx = 0; idx < pathParts.length - 1; idx++) {
      const val = currentObject[pathParts[idx]];

      if (val == null) {
        return undefined;
      }

      currentObject = val;
    }

    const retVal = currentObject[pathParts[pathParts.length - 1]];
    return retVal;
  }

}
