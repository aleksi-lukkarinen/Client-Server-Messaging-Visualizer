import * as Config from "./Config.js";
import * as EnvInfo from "./EnvironmentInfo.js";
import * as StringUtils from "./StringUtils.js";




class Model {

  constructor(ui, setupData, log) {
    this.ui = ui;
    this.name = setupData.name;
    this.log = log;
    this.actors = {};
    this.steps = [];
    this.currentStep = 1;

    this.setupModel(setupData);
  }

  setupModel(setupData) {
    for (let step of setupData.steps) {
      this.steps.push(step);
    }

    this.currentStep = 1;
    console.log(this.steps);
    this.emitModelChangedEvent();
  }

  moveToFirstStep() {
    if (!this.canMoveToFirstStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the first step while already being there.");
    }

    this.currentStep = 1;
    this.emitModelChangedEvent();
  }

  canMoveToFirstStep() {
    return this.steps.length > 1
            && this.currentStep > 1;
  }

  moveToPreviousStep() {
    if (!this.canMoveToPreviousStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the previous step while already being in the first one.");
    }

    this.currentStep = this.currentStep - 1;
    this.emitModelChangedEvent();
  }

  canMoveToPreviousStep() {
    return this.steps.length > 1
            && this.currentStep > 1;
  }

  moveToNextStep() {
    if (!this.canMoveToNextStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the next step while already being in the last one.");
    }

    this.currentStep = this.currentStep + 1;
    this.emitModelChangedEvent();
  }

  canMoveToNextStep() {
    return this.steps.length > 1
            && this.currentStep < this.steps.length;
  }

  moveToLastStep() {
    if (!this.canMoveToLastStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the last step while already being there.");
    }

    this.currentStep = this.steps.length;
    this.emitModelChangedEvent();
  }

  canMoveToLastStep() {
    return this.steps.length > 1
            && this.currentStep < this.steps.length;
  }

  emitModelChangedEvent() {
    this.emitEvent(
          Config.eventNames.MODEL_CHANGED,
          [this.name,]);
  }

  emitEvent(id, params) {
    const e = $.Event(id);
    $(this).trigger(e, params);
  }

}




class UI {

  constructor(container, setupData, domFactory) {
    this.container = container;
    this.setupData = setupData;
    this.name = setupData.name;
    this.frames = {};
    this.buttons = {};
    this.domFactory = domFactory;
    this.log = new Logger(this.name);
    this.model = new Model(this, setupData, this.log);
  }

  init() {
    this.emitInitializationBeginsEvent();
    this.log.addInitializationBeginsEvent();

    this.createOuterFrame();
    this.createAnimationFrame();
    this.createControlFrame();

    // The UI listens change events from the model to update itself
    $(this.model).bind(
            Config.eventNames.MODEL_CHANGED,
            $.proxy(this.update, this));

    this.update();

    this.emitInitializationFinishedEvent();
    this.log.addInitializationFinishedEvent();
  }

  createControlFrame(DF = this.domFactory) {
    const cls = Config.cssClasses;
    const sdKeys = Config.setupDataKeys;
    const uiTxt = Config.uiTexts;

    const frame = DF.createHtmlDiv(cls.CSMV_CONTROL_FRAME);
    frame.appendTo(this.frames.outer);
    this.frames.control = frame;

    this.createButton("toFirstStep",
          uiTxt.TO_FIRST_STEP_TITLE, sdKeys.TO_FIRST_STEP_TITLE,
          cls.CSMV_BUTTON_TO_FIRST_STEP,
          this.handleToFirstStepClick, frame);

    this.createButton("toPreviousStep",
          uiTxt.TO_PREVIOUS_STEP_TITLE, sdKeys.TO_PREVIOUS_STEP_TITLE,
          cls.CSMV_BUTTON_TO_PREVIOUS_STEP,
          this.handleToPreviousStepClick, frame);

    this.createButton("toNextStep",
          uiTxt.TO_NEXT_STEP_TITLE, sdKeys.TO_NEXT_STEP_TITLE,
          cls.CSMV_BUTTON_TO_NEXT_STEP,
          this.handleToNextStepClick, frame);

    this.createButton("toLastStep",
          uiTxt.TO_LAST_STEP_TITLE, sdKeys.TO_LAST_STEP_TITLE,
          cls.CSMV_BUTTON_TO_LAST_STEP,
          this.handleToLastStepClick, frame);
  }

  createButton(
        collectionName, defaultTitle, setupDataKeyForTitle,
        cssClass, clickHandler, parent, DF = this.domFactory) {

    const sdKeys = Config.setupDataKeys;

    let title = defaultTitle;
    if (this.setupData.hasOwnProperty(sdKeys.VIS_ENV)) {
      const env = this.setupData[sdKeys.VIS_ENV];

      if (env.hasOwnProperty(sdKeys.BUTTONS)) {
        const btns = env[sdKeys.BUTTONS];

        if (btns.hasOwnProperty(setupDataKeyForTitle)) {
          title = btns[setupDataKeyForTitle];
        }
      }
    }

    const b = DF.createHtmlButton(
                Config.cssClasses.CSMV_BUTTON);
    b.text(title);

    if (StringUtils.isNonEmptyString(cssClass)) {
      b.addClass(cssClass);
    }

    b.click($.proxy(clickHandler, this));
    b.appendTo(parent);
    this.buttons[collectionName] = b;
  }

  update() {
    this.updateButtonStates();
  }

  updateButtonStates() {
    const btns = this.buttons;
    const mdl = this.model;

    this.updateButtonState(btns.toFirstStep, mdl.canMoveToFirstStep());
    this.updateButtonState(btns.toPreviousStep, mdl.canMoveToPreviousStep());
    this.updateButtonState(btns.toNextStep, mdl.canMoveToNextStep());
    this.updateButtonState(btns.toLastStep, mdl.canMoveToLastStep());
  }

  updateButtonState(button, isEnabled) {
    const cls = Config.cssClasses;
    const b = $(button);

    b.attr(Config.htmlAttributes.DISABLED, !isEnabled);

    if (isEnabled) {
      b.addClass(cls.CSMV_ENABLED);
      b.removeClass(cls.CSMV_DISABLED);
    }
    else {
      b.removeClass(cls.CSMV_ENABLED);
      b.addClass(cls.CSMV_DISABLED);
      b.blur();
    }
  }

  handleToFirstStepClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToFirstStep();

    this.emitToFirstStepButtonClickedEvent();
    this.log.addToFirstClickedEvent();
  }

  handleToPreviousStepClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToPreviousStep();

    this.emitToPreviousStepButtonClickedEvent();
    this.log.addToPreviousClickedEvent();
  }

  handleToNextStepClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToNextStep();

    this.emitToNextStepButtonClickedEvent();
    this.log.addToNextClickedEvent();
  }

  handleToLastStepClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToLastStep();

    this.emitToLastStepButtonClickedEvent();
    this.log.addToLastClickedEvent();
    console.log(this.log.get());
  }

  createAnimationFrame(DF = this.domFactory) {
    const frameDiv = DF.createHtmlDiv(
              Config.cssClasses.CSMV_ANIMATION_FRAME);

    const sdKeys = Config.setupDataKeys;
    if (this.setupData.hasOwnProperty(sdKeys.VIS_ENV)) {
      const e = this.setupData[sdKeys.VIS_ENV];

      if (e.hasOwnProperty(sdKeys.VIS_ANIMATION_FRAME)) {
        const f = e[sdKeys.VIS_ANIMATION_FRAME];

        if (f.hasOwnProperty(sdKeys.WIDTH)) {
          frameDiv.css(Config.cssProperties.WIDTH, f[sdKeys.WIDTH]);
        }
        if (f.hasOwnProperty(sdKeys.HEIGHT)) {
          frameDiv.css(Config.cssProperties.HEIGHT, f[sdKeys.HEIGHT]);
        }
      }
    }

    frameDiv.appendTo(this.frames.outer);
    this.frames.animation = frameDiv;
  }

  createOuterFrame(DF = this.domFactory) {
    const cls = Config.cssClasses;
    const sdKeys = Config.setupDataKeys;

    const frameDiv = DF.createHtmlDiv(cls.CSMV_OUTER_FRAME);
    frameDiv.appendTo(this.container);
    this.frames.outer = frameDiv;

    this.createHeadingDiv(
          sdKeys.VIS_TITLE, cls.CSMV_VIS_TITLE,
          frameDiv, "title", "titleDiv", "title");

    this.createHeadingDiv(
          sdKeys.VIS_DESCRIPTION, cls.CSMV_VIS_DESCRIPTION,
          frameDiv, "description", "descriptionDiv", "description");
  }

  createHeadingDiv(
          setupDataKey, cssClass, parent,
          dataKeyForThis, divKeyForThis,
          verboseTypeForError, DF = this.domFactory) {

    if (this.setupData.hasOwnProperty(setupDataKey)) {
      const d = this.setupData[setupDataKey];

      if (!StringUtils.isNonEmptyString(d)) {
        throw ErrorFactory.forIncorrectSetupData(
                  `Visualization '${this.name}' has an invalid ${verboseTypeForError}; ` +
                  `it must be a string that contains not only whitespace.`);
      }

      const content = $.trim(d);
      const contentDiv = DF.createHtmlDiv(cssClass);
      contentDiv.text(content);
      contentDiv.appendTo(parent);
      this[dataKeyForThis] = content;
      this[divKeyForThis] = contentDiv;
    }
  }

  emitInitializationBeginsEvent() {
    this.emitEvent(Config.eventNames.INITIALIZATION_BEGINS, [this.name,]);
  }

  emitInitializationFinishedEvent() {
    this.emitEvent(Config.eventNames.INITIALIZATION_FINISHED, [this.name,]);
  }

  emitToFirstStepButtonClickedEvent() {
    this.emitEvent(Config.eventNames.TO_FIRST_STEP_CLICKED, [this.name,]);
  }

  emitToPreviousStepButtonClickedEvent() {
    this.emitEvent(Config.eventNames.TO_PREVIOUS_STEP_CLICKED, [this.name,]);
  }

  emitToNextStepButtonClickedEvent() {
    this.emitEvent(Config.eventNames.TO_NEXT_STEP_CLICKED, [this.name,]);
  }

  emitToLastStepButtonClickedEvent() {
    this.emitEvent(Config.eventNames.TO_LAST_STEP_CLICKED, [this.name,]);
  }

  emitEvent(id, params) {
    const e = jQuery.Event(id);
    $(this.container).trigger(e, params);
  }

}




class Logger {

  constructor(visualizationName) {
    this.log = [];

    this.add(Config.loggingKeys.METADATA, {
      webPage: {
        location: {
          url:            EnvInfo.documentURL,
          /*
          protocol:       EnvInfo.locationProtocol,
          host:           EnvInfo.locationHost,
          hostname:       EnvInfo.locationHostname,
          port:           EnvInfo.locationPort,
          pathname:       EnvInfo.locationPathname,
          hash:           EnvInfo.locationHash,
          query:          EnvInfo.locationQuery,
          */
        },
        referrer:         EnvInfo.documentReferrer,
        title:            EnvInfo.documentTitle,
        charSet:          EnvInfo.documentCharacterSet,
      },
      navigator: {
        userAgent:        EnvInfo.userAgent,
        platform:         EnvInfo.platform,
        appName:          EnvInfo.appName,
        appVersion:       EnvInfo.appVersion,
        product:          EnvInfo.product,
      },
      screen: {
        totalHeight:      EnvInfo.totalScreenHeight,
        totalWidth:       EnvInfo.totalScreenWidth,
        colorDepth:       EnvInfo.colorDepth,
      },
      visualization: {
        name:             visualizationName,
      },
    });
  }

  addInitializationBeginsEvent() {
    this.add(Config.loggingKeys.INITIALIZATION_BEGINS);
  }

  addInitializationFinishedEvent() {
    this.add(Config.loggingKeys.INITIALIZATION_FINISHED);
  }

  addToFirstClickedEvent() {
    this.add(Config.loggingKeys.TO_FIRST_STEP_CLICKED);
  }

  addToPreviousClickedEvent() {
    this.add(Config.loggingKeys.TO_PREVIOUS_STEP_CLICKED);
  }

  addToNextClickedEvent() {
    this.add(Config.loggingKeys.TO_NEXT_STEP_CLICKED);
  }

  addToLastClickedEvent() {
    this.add(Config.loggingKeys.TO_LAST_STEP_CLICKED);
  }

  add(type, data) {
    const timestamp = Date.now();
    const timezoneOffset = new Date(timestamp).getTimezoneOffset();
    const logEntry = [timestamp, timezoneOffset, type,];

    if (arguments.length == 2) {
      if ($.isArray(data)) {
        data.forEach(function(item) {
          logEntry.push(item);
        });
      }
      else {
        logEntry.push(data);
      }
    }

    this.log.push(logEntry);
  }

  get() {
    return this.log;
  }

}




class DOMFactory {

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




class ErrorFactory {

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




const BaseError = function(message) {
  this.message = this.formatErrorMessage(message);
};

BaseError.prototype = new Error();

BaseError.prototype.formatErrorMessage = function(message) {
  return StringUtils.ensureThatEndsWithPeriod(
            `${Config.application.NAME}: ${message}`);
};




class Bootstrapper {

  execute() {
    const setupDataRoot = document[Config.SETUP_DATA_ROOT_KEY];

    this.ensureThatSetupDataArrayIsGiven(setupDataRoot);
    this.ensureThatSetupDataAndHTMLDocContainEqualNumberOfVisualizations(setupDataRoot);
    this.instantiateVisualizations();
  }

  ensureThatSetupDataArrayIsGiven(setupDataRoot) {
    if (setupDataRoot == null) {
      throw ErrorFactory.createBaseErrorFor(
              `Configuration using document.${Config.SETUP_DATA_ROOT_KEY} is missing.`);
    }

    if (!Array.isArray(setupDataRoot)) {
      throw ErrorFactory.forIncorrectSetupData(
              "The root element must be an array.");
    }
  }

  ensureThatSetupDataAndHTMLDocContainEqualNumberOfVisualizations(setupDataRoot) {
    const elems = this.allVisualizationElements();
    if (elems.length != setupDataRoot.length) {
      const msg = `There are ${elems.length} visualization(s) in the HTML file ` +
                  `but setup data is given for ${setupDataRoot.length} visualiation(s).`;

      // TODO: Print lists of names of both the existing divs and setups

      throw ErrorFactory.forIncorrectSetupData(msg);
    }
  }

  instantiateVisualizations() {
    const domFactory = new DOMFactory();

    for (const [idx, visualizationSetup] of document[Config.SETUP_DATA_ROOT_KEY].entries()) {
      if (!visualizationSetup.hasOwnProperty(Config.setupDataKeys.VIS_NAME)) {
        throw ErrorFactory.forIncorrectSetupData(
                `${idx + 1}. visualization does not have a name.`);
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
    ui.init();
  }

  allVisualizationElements() {
    return $(`.${Config.cssClasses.CSMV_VISUALIZATION}`);
  }

  visualizationElementsFor(visualizationName) {
    const clazz = Config.cssClasses.CSMV_VISUALIZATION;
    const nameAttr = Config.htmlAttributes.VISUALIZATION_NAME;

    return $(`.${clazz}[${nameAttr}='${visualizationName}']`);
  }

}

$(document).ready(function() {
  (new Bootstrapper()).execute();
});
