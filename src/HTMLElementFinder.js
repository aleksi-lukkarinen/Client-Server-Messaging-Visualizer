/**
 * HTMLElementFinder class module.
 *
 * @module HTMLElementFinder
 */

import * as Config from "./Config.js";




/** Provides utility functions for finding HTML elements. */
export default class HTMLElementFinder {

  /* eslint class-methods-use-this: "off" */

  actorDivFor(actorId, animationFrame) {
    const clazz = Config.cssClasses.CSMV_ACTOR;
    const nameAttr = Config.htmlAttributes.CSMV_NAME;

    return animationFrame.find(`.${clazz}[${nameAttr}='${actorId}']`);
  }

  allVisualizationElements() {
    return $(`.${Config.cssClasses.CSMV_VISUALIZATION}`);
  }

  visualizationElementsFor(visualizationName) {
    const clazz = Config.cssClasses.CSMV_VISUALIZATION;
    const nameAttr = Config.htmlAttributes.CSMV_NAME;

    return $(`.${clazz}[${nameAttr}='${visualizationName}']`);
  }

}
