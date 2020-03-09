/**
 * UI class module.
 *
 * @module UI
 */

import * as Config from "./Config.js";
import * as StringUtils from "./StringUtils.js";
import ErrorFactory from "./ErrorFactory.js";
import Logger from "./Logger.js";
import Model from "./Model.js";




 /** The user interface. */
export default class UI {

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
    const e = $.Event(id);
    $(this.container).trigger(e, params);
  }

}
