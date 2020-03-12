/**
 * Bootstrapper class module.
 *
 * @module Bootstrapper
 */

import * as Config from "./Config.js";
import DOMFactory from "./DOMFactory.js";
import ErrorFactory from "./ErrorFactory.js";
import ObjectUtils from "./ObjectUtils.js";
import StringUtils from "./StringUtils.js";
import ApplicationContext from "./ApplicationContext.js";
import UI from "./UI.js";




/**
 * Finds both the visualizations given on the HTML page as well as
 * the related setup data, and starts the initialization of each
 * detected visualization.
 */
export default class Bootstrapper {

  constructor(setupDataArray) {
    this._allSetupData = setupDataArray;

    this.initApplicationContext();
  }

  initApplicationContext() {
    const ac = new ApplicationContext();
    ac.domFactory = new DOMFactory();
    ac.errorFactory = new ErrorFactory(ac);
    ac.objectUtils = new ObjectUtils();
    ac.stringUtils = new StringUtils();
    this._appCtx = ac;
  }

  execute() {
    this.ensureThatSetupDataArrayIsGiven();
    this.ensureThatSetupDataAndHTMLDocContainEqualNumberOfVisualizations();
    this.instantiateVisualizations();
  }

  ensureThatSetupDataArrayIsGiven(AC = this._appCtx) {
    if (this._allSetupData == null) {
      throw AC.errorFactory.createBaseErrorFor(
              `Configuration using document.${Config.SETUP_DATA_ROOT_KEY} is missing.`);
    }

    if (!Array.isArray(this._allSetupData)) {
      throw AC.errorFactory.forIncorrectSetupData(
              "The root element must be an array.");
    }
  }

  ensureThatSetupDataAndHTMLDocContainEqualNumberOfVisualizations(AC = this._appCtx) {
    const elems = this.allVisualizationElements();
    if (elems.length != this._allSetupData.length) {
      const msg = `There are ${elems.length} visualization(s) in the HTML file ` +
                  `but setup data is given for ${this._allSetupData.length} visualiation(s).`;

      // TODO: Print lists of names of both the existing divs and setups

      throw AC.errorFactory.forIncorrectSetupData(msg);
    }
  }

  instantiateVisualizations(AC = this._appCtx) {
    for (const [idx, visualizationSetup] of document[Config.SETUP_DATA_ROOT_KEY].entries()) {
      if (!Object.prototype.hasOwnProperty.call(visualizationSetup, Config.setupDataKeys.NAME)) {
        throw AC.errorFactory.forIncorrectSetupData(
                `The ${idx + 1}. visualization does not have a name.`);
      }

      // TODO: Is the name a non-empty string? if (StringUtils.isNonEmptyString(t)) {

      this.instantiateVisualizationBasedOn(visualizationSetup);
    }
  }

  instantiateVisualizationBasedOn(setupDataEntry, AC = this._appCtx) {
    const elems = this.visualizationElementsFor(setupDataEntry.name);

    if (elems.length === 0) {
      throw AC.errorFactory.forIncorrectSetup(
              `Setup data is given for visualization '${setupDataEntry.name}', `+
              "but the HTML file does not contain a container element for it.");
    }
    if (elems.length > 1) {
      throw AC.errorFactory.forIncorrectSetup(
              "The HTML file contains multiple container elements " +
              `for visualization '${setupDataEntry.name}'.`);
    }

    const containerElement = elems[0];
    new UI(containerElement, setupDataEntry, AC);
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
