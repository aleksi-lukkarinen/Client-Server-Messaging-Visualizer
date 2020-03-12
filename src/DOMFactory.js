/**
 * DOMFactory class module.
 *
 * @module DOMFactory
 */

import * as Config from "./Config.js";




/** Creates resources related to the document object model. */
export default class DOMFactory {

  /* eslint class-methods-use-this: "off" */

  createHtmlDiv(cssClass) {
    return this.createHtmlTag(Config.htmlTags.DIV, cssClass);
  }

  createHtmlButton(cssClass) {
    return this.createHtmlTag(Config.htmlTags.BUTTON, cssClass);
  }

  createHtmlTag(tagName, cssClass) {
    const tag = Config.htmlTags.TAG_START + tagName + Config.htmlTags.SINGLE_TAG_END;
    const attributes = {};
    attributes[Config.htmlAttributes.CLASS] = cssClass;
    return $(tag, attributes);
  }

}
