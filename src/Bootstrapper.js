/**
 * Bootstrapper class module.
 *
 * @module Bootstrapper
 */

import * as Config from "./Config.js";
import ErrorFactory from "./ErrorFactory.js";
import DOMFactory from "./DOMFactory.js";
import UI from "./UI.js";




/**
 * Finds both the visualizations given on the HTML page as well as
 * the related setup data, and starts the initialization of each
 * detected visualization.
 */
export default class Bootstrapper {

  constructor(setupDataArray) {
    this.allSetupData = setupDataArray;
  }

  execute() {
    this.ensureThatSetupDataArrayIsGiven();
    this.ensureThatSetupDataAndHTMLDocContainEqualNumberOfVisualizations();
    this.instantiateVisualizations();
  }

  ensureThatSetupDataArrayIsGiven() {
    if (this.allSetupData == null) {
      throw ErrorFactory.createBaseErrorFor(
              `Configuration using document.${Config.SETUP_DATA_ROOT_KEY} is missing.`);
    }

    if (!Array.isArray(this.allSetupData)) {
      throw ErrorFactory.forIncorrectSetupData(
              "The root element must be an array.");
    }
  }

  ensureThatSetupDataAndHTMLDocContainEqualNumberOfVisualizations() {
    const elems = this.allVisualizationElements();
    if (elems.length != this.allSetupData.length) {
      const msg = `There are ${elems.length} visualization(s) in the HTML file ` +
                  `but setup data is given for ${this.allSetupData.length} visualiation(s).`;

      // TODO: Print lists of names of both the existing divs and setups

      throw ErrorFactory.forIncorrectSetupData(msg);
    }
  }

  instantiateVisualizations() {
    const domFactory = new DOMFactory();

    for (const [idx, visualizationSetup] of document[Config.SETUP_DATA_ROOT_KEY].entries()) {
      if (!visualizationSetup.hasOwnProperty(Config.setupDataKeys.NAME)) {
        throw ErrorFactory.forIncorrectSetupData(
                `The ${idx + 1}. visualization does not have a name.`);
      }

      // TODO: Is the name a non-empty string? if (StringUtils.isNonEmptyString(t)) {

      this.instantiateVisualizationBasedOn(visualizationSetup, domFactory);
    }
  }

  instantiateVisualizationBasedOn(setupDataEntry, domFactory) {
    const elems = this.visualizationElementsFor(setupDataEntry.name);

    if (elems.length === 0) {
      throw ErrorFactory.forIncorrectSetup(
              `Setup data is given for visualization '${setupDataEntry.name}', `+
              `but the HTML file does not contain a container element for it.`);
    }
    if (elems.length > 1) {
      throw ErrorFactory.forIncorrectSetup(
              `The HTML file contains multiple container elements ` +
              `for visualization '${setupDataEntry.name}'.`);
    }

    const containerElement = elems[0];
    const ui = new UI(containerElement, setupDataEntry, domFactory);
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
