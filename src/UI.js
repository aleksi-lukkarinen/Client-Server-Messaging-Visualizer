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
    this.createActors();

    // The UI listens change events from the model to update itself
    $(this.model).bind(
            Config.eventNames.MODEL_CHANGED,
            $.proxy(this.update, this));

    this.update();

    this.emitInitializationFinishedEvent();
    this.log.addInitializationFinishedEvent();
  }
  
  createActors() {
    const sdKeys = Config.setupDataKeys;

    if (!this.setupData.hasOwnProperty(sdKeys.ACTORS)) {
      console.log(`Warning: Visualization '${this.name}' does not have any actors defined.`);
      return;
    }

    const actors = this.setupData[sdKeys.ACTORS];

    if (!Array.isArray(actors)) {
      throw ErrorFactory.forIncorrectSetupData(
              `Visualization '${this.name}': The 'actors' key ` +
              `in the setup data has to be an array.`);
    }

    if (actors.length < 1) {
      console.log(`Warning: Visualization '${this.name}' does not have any actors defined.`);
      return;
    }

    for (const [idx, actorSetup] of actors.entries()) {
      if (!actorSetup.hasOwnProperty(sdKeys.ID)) {
        throw ErrorFactory.forIncorrectSetupData(
                `The ${idx + 1}. actor of visualization '${this.name}' does not have an ID.`);
      }

      this.createSingleActor(actorSetup);
    }
  }

  createSingleActor(actorSetup, DF = this.domFactory) {
    const sdKeys = Config.setupDataKeys;

    const actorDiv = DF.createHtmlDiv(Config.cssClasses.CSMV_ACTOR);

    if (actorSetup.hasOwnProperty(sdKeys.TITLE)) {
      const title = actorSetup[sdKeys.TITLE];
      if (StringUtils.isNonEmptyString(title)) {
        const titleDiv = DF.createHtmlDiv(Config.cssClasses.CSMV_ACTOR_TITLE);
        titleDiv.text(title);
        titleDiv.appendTo(actorDiv);
      }
    }

    let width = "100px";
    if (actorSetup.hasOwnProperty(sdKeys.WIDTH)) {
      width = actorSetup[sdKeys.WIDTH];
    }
    actorDiv.css(Config.cssProperties.WIDTH, width);

    let height = "100px";
    if (actorSetup.hasOwnProperty(sdKeys.HEIGHT)) {
      height = actorSetup[sdKeys.HEIGHT];
    }
    actorDiv.css(Config.cssProperties.HEIGHT, height);

    if (actorSetup.hasOwnProperty(sdKeys.CSS_CLASSES)) {
      let cssClasses = actorSetup[sdKeys.CSS_CLASSES];

      if ($.type(cssClasses) === "string") {
        cssClasses = [cssClasses];
      }
      if (Array.isArray(cssClasses)) {
        for (const c of cssClasses) {
          if (StringUtils.isNonEmptyString(c)) {
            actorDiv.addClass(c);
          }
        }
      }
    }
    
    if (actorSetup.hasOwnProperty(sdKeys.CONTENT_HTML)) {
      actorDiv.html(actorSetup[sdKeys.CONTENT_HTML]);
    }
    
    actorDiv.appendTo(this.frames.animation);
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
    if (this.setupData.hasOwnProperty(sdKeys.ENV)) {
      const e = this.setupData[sdKeys.ENV];

      if (e.hasOwnProperty(sdKeys.ANIMATION_FRAME)) {
        const f = e[sdKeys.ANIMATION_FRAME];

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
          sdKeys.TITLE, cls.CSMV_VIS_TITLE,
          frameDiv, "title", "titleDiv", "title");

    this.createHeadingDiv(
          sdKeys.DESCRIPTION, cls.CSMV_VIS_DESCRIPTION,
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
