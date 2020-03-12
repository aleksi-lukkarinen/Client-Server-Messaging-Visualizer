/**
 * UI class module.
 *
 * @module UI
 */

import * as Config from "./Config.js";
import Logger from "./Logger.js";
import Model from "./Model.js";




 /** The user interface. */
export default class UI {

  constructor(container, setupData, appContext) {
    this.name = setupData.name;
    this.log = new Logger(this.name);

    this.log.addInitializationBeginsEvent();
    this.emitInitializationBeginsEvent();

    this.container = container;
    this.setupData = setupData;
    this.appCtx = appContext;

    this.model = new Model(setupData, appContext, this.log);

    this.frames = {};
    this.buttons = {};

    this.emitUIInitializationBeginsEvent();

    this.createOuterFrame();
    this.createAnimationFrame();
    this.createControlFrame();
    this.createActors();

    this.update();

    // The UI listens events from the model to update itself
    $(this.model).bind(
            Config.eventNames.MODEL_CHANGED,
            $.proxy(this.update, this));

    this.emitUIInitializationFinishedEvent();
    this.emitInitializationFinishedEvent();
    this.log.addInitializationFinishedEvent();
  }

  createActors(AC = this.appCtx) {
    const sdKeys = Config.setupDataKeys;

    if (!Object.prototype.hasOwnProperty.call(this.setupData, sdKeys.ACTORS)) {
      console.log(`Warning: Visualization '${this.name}' does not have any actors defined.`);
      return;
    }

    const actors = this.setupData[sdKeys.ACTORS];

    if (!Array.isArray(actors)) {
      throw AC.errorFactory.forIncorrectSetupData(
              `Visualization '${this.name}': The 'actors' key ` +
              "in the setup data has to be an array.");
    }

    if (actors.length < 1) {
      console.log(`Warning: Visualization '${this.name}' does not have any actors defined.`);
      return;
    }

    for (const [idx, actorSetup] of actors.entries()) {
      if (!Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.ID)) {
        throw AC.errorFactory.forIncorrectSetupData(
                `The ${idx + 1}. actor of visualization '${this.name}' does not have an ID.`);
      }

      this.createSingleActor(actorSetup);
    }
  }

  createSingleActor(actorSetup, AC = this.appCtx) {
    const sdKeys = Config.setupDataKeys;

    const actorDiv = AC.domFactory.createHtmlDiv(Config.cssClasses.CSMV_ACTOR);
    actorDiv.attr(Config.htmlAttributes.CSMV_NAME, actorSetup[sdKeys.ID]);

    // TODO: Defaults to Config
    let width = "100px";
    if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.WIDTH)) {
      width = actorSetup[sdKeys.WIDTH];
    }
    actorDiv.css(Config.cssProperties.WIDTH, width);

    let height = "100px";
    if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.HEIGHT)) {
      height = actorSetup[sdKeys.HEIGHT];
    }
    actorDiv.css(Config.cssProperties.HEIGHT, height);

    // TODO: REFACTOR!!!!
    if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.PRESET)) {
      const preset = actorSetup[sdKeys.PRESET];

      let stereotypeDiv;
      if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.STEREOTYPE)) {
        const stereotype = actorSetup[sdKeys.STEREOTYPE];
        if (AC.stringUtils.isNonEmptyString(stereotype)) {
          stereotypeDiv = AC.domFactory.createHtmlDiv(Config.cssClasses.CSMV_ACTOR_STEREOTYPE);
          stereotypeDiv.text(`«${stereotype}»`);
          stereotypeDiv.appendTo(actorDiv);
        }
      }

      let titleDiv;
      if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.TITLE)) {
        const title = actorSetup[sdKeys.TITLE];
        if (AC.stringUtils.isNonEmptyString(title)) {
          titleDiv = AC.domFactory.createHtmlDiv(Config.cssClasses.CSMV_ACTOR_TITLE);
          titleDiv.text(title);
          titleDiv.appendTo(actorDiv);
        }
      }

      let content;
      let isHtmlContent = false;
      if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.CONTENT)) {
        content = actorSetup[sdKeys.CONTENT];
        if (!AC.stringUtils.isNonEmptyString(content)) {
          content = undefined;
        }
      }
      else if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.CONTENT_HTML)) {
        content = actorSetup[sdKeys.CONTENT_HTML];
        if (!AC.stringUtils.isNonEmptyString(content)) {
          content = undefined;
        }
        else {
          isHtmlContent = true;
        }
      }

      let contentDiv;
      if (content != null) {
        contentDiv = AC.domFactory.createHtmlDiv(
            Config.cssClasses.CSMV_ACTOR_CONTENT);
        if (isHtmlContent) {
          contentDiv.html(content);
        }
        else {
          contentDiv.text(content);
        }
        contentDiv.appendTo(actorDiv);
      }

      switch (preset.toLowerCase()) {
        case "browser":
          actorDiv.addClass(Config.cssClasses.CSMV_PRESET_BROWSER);
          break;

        case "server":
          actorDiv.addClass(Config.cssClasses.CSMV_PRESET_SERVER);
          break;

        case "textblock":
          actorDiv.addClass(Config.cssClasses.CSMV_PRESET_TEXTBLOCK);

          if (titleDiv != null) {
            titleDiv.addClass(
                Config.cssClasses.CSMV_PRESET_TEXTBLOCK_TITLE);
          }
          if (contentDiv != null) {
            contentDiv.addClass(
                Config.cssClasses.CSMV_PRESET_TEXTBLOCK_CONTENT);
          }
          break;

        default:
          // TODO: ERROR: Unknown preset!
      }
    }
    else {
      actorDiv.addClass(Config.cssClasses.CSMV_CUSTOM_ACTOR);

      if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.CSS_CLASSES)) {
        const classes = actorSetup[sdKeys.CSS_CLASSES];
        if (Array.isArray(classes)) {
          for (const c of classes) {
            if (AC.stringUtils.isNonEmptyString(c)) {
              actorDiv.addClass(c);
            }
          }
        }
        else if (typeof classes === "string") {
          actorDiv.addClass(classes);
        }
      }

      if (Object.prototype.hasOwnProperty.call(actorSetup, sdKeys.CONTENT_HTML)) {
        actorDiv.html(actorSetup[sdKeys.CONTENT_HTML]);
      }
    }

    if (!this.model.ignoreVisibility) {
      actorDiv.hide();    // Hide actors by default
    }

    if (this.model.highlightActorBorders) {
      actorDiv.addClass(Config.cssClasses.CSMV_DEBUG_BORDER);
    }

    actorDiv.appendTo(this.frames.animation);
  }

  createControlFrame(AC = this.appCtx) {
    const cls = Config.cssClasses;
    const sdKeys = Config.setupDataKeys;
    const uiTxt = Config.uiTexts;

    const frame = AC.domFactory.createHtmlDiv(cls.CSMV_CONTROL_FRAME);
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

    // TODO: Refactor to use Options
    let shouldBeVisible = true;
    if (Object.prototype.hasOwnProperty.call(this.setupData, sdKeys.ENV)) {
      const env = this.setupData[sdKeys.ENV];

      if (Object.prototype.hasOwnProperty.call(env, sdKeys.BUTTONS)) {
        const btns = env[sdKeys.BUTTONS];

        if (Object.prototype.hasOwnProperty.call(btns, sdKeys.SHOW_TO_LAST_STEP_BUTTON)) {
          const val = btns[sdKeys.SHOW_TO_LAST_STEP_BUTTON];
          if (typeof val === "boolean") {
            shouldBeVisible = val;
          }
        }
      }
    }
    if (shouldBeVisible) {
      this.createButton("toLastStep",
            uiTxt.TO_LAST_STEP_TITLE, sdKeys.TO_LAST_STEP_TITLE,
            cls.CSMV_BUTTON_TO_LAST_STEP,
            this.handleToLastStepClick, frame);
    }

    if (this.model.isStepCounterVisible) {
      const c = AC.domFactory.createHtmlDiv(
                  Config.cssClasses.CSMV_STEP_COUNTER);

      c.text(this.composeStepCounterText());

      if (this.model.lastStepNumber === 0) {
        c.addClass(Config.cssClasses.CSMV_STEP_COUNTER_NO_STEPS);
      }

      c.appendTo(frame);
      this.stepCounter = c;
    }
  }

  composeStepCounterText(AC = this.appCtx) {
    let counterText =
          AC.stringUtils.ensureThatEndsWithSpace(
                          this.model.stepCounterTitle);

    if (this.model.lastStepNumber === 0) {
      return this.model.stepCounterNoStepsTitle;
    }

    counterText += this.model.currentStepNumber;
    if (this.model.isStepCounterTotalVisible) {
      counterText += "/" + this.model.lastStepNumber;
    }

    return counterText;
  }

  createButton(
        collectionName, defaultTitle, setupDataKeyForTitle,
        cssClass, clickHandler, parent, AC = this.appCtx) {

    const sdKeys = Config.setupDataKeys;

    // TODO: Refactor to use options
    let title = defaultTitle;
    if (Object.prototype.hasOwnProperty.call(this.setupData, sdKeys.ENV)) {
      const env = this.setupData[sdKeys.ENV];

      if (Object.prototype.hasOwnProperty.call(env, sdKeys.BUTTONS)) {
        const btns = env[sdKeys.BUTTONS];

        if (Object.prototype.hasOwnProperty.call(btns, setupDataKeyForTitle)) {
          title = btns[setupDataKeyForTitle];
        }
      }
    }

    const b = AC.domFactory.createHtmlButton(
                Config.cssClasses.CSMV_BUTTON);
    b.text(title);

    if (AC.stringUtils.isNonEmptyString(cssClass)) {
      b.addClass(cssClass);
    }

    b.click($.proxy(clickHandler, this));
    b.appendTo(parent);
    this.buttons[collectionName] = b;
  }

  update() {
    // TODO: Save button focus and restore, if possible
    this.disableButtons();
    this.updateActors();
    this.updateStepCounter();
    this.updateButtonStates();
  }

  updateStepCounter() {
    if (this.model.isStepCounterVisible) {
      this.stepCounter.text(this.composeStepCounterText());

      if (this.model.lastStepNumber === 0) {
        this.stepCounter.addClass(
                Config.cssClasses.CSMV_STEP_COUNTER_NO_STEPS);
      }
      else {
        this.stepCounter.removeClass(
                Config.cssClasses.CSMV_STEP_COUNTER_NO_STEPS);
      }
    }
  }

  disableButtons() {
    const btns = this.buttons;

    this.updateButtonState(btns.toFirstStep, false);
    this.updateButtonState(btns.toPreviousStep, false);
    this.updateButtonState(btns.toNextStep, false);
    this.updateButtonState(btns.toLastStep, false);
  }

  updateActors() {
    const setup = this.model.currentStepSetup;

    for (const instruction of setup) {
      const [op, ...params] = instruction;
      switch (op) {
        case "set-pos": {
          const [actorId, leftPos, topPos] = params;
          const e = this.actorDivFor(actorId);
          e.css("left", leftPos);
          e.css("top", topPos);
          }
          break;

        case "show":
          if (!this.model.ignoreVisibility) {
            for (const actorId of params) {
              this.actorDivFor(actorId).show();
            }
          }
          break;

        case "hide":
          if (!this.model.ignoreVisibility) {
            for (const actorId of params) {
              this.actorDivFor(actorId).hide();
            }
          }
          break;

        default:
          // TODO: ERROR: Unknown actor opcode!
      }
    }
  }

  actorDivFor(actorId) {
    const clazz = Config.cssClasses.CSMV_ACTOR;
    const nameAttr = Config.htmlAttributes.CSMV_NAME;

    return $(`.${clazz}[${nameAttr}='${actorId}']`);
  }

  updateButtonStates() {
    const btns = this.buttons;
    const mdl = this.model;

    this.updateButtonState(btns.toFirstStep, mdl.canMoveToFirstStep);
    this.updateButtonState(btns.toPreviousStep, mdl.canMoveToPreviousStep);
    this.updateButtonState(btns.toNextStep, mdl.canMoveToNextStep);
    this.updateButtonState(btns.toLastStep, mdl.canMoveToLastStep);
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

  createAnimationFrame(AC = this.appCtx) {
    const frameDiv = AC.domFactory.createHtmlDiv(
              Config.cssClasses.CSMV_ANIMATION_FRAME);

    const sdKeys = Config.setupDataKeys;
    if (Object.prototype.hasOwnProperty.call(this.setupData, sdKeys.ENV)) {
      const e = this.setupData[sdKeys.ENV];

      if (Object.prototype.hasOwnProperty.call(e, sdKeys.ANIMATION_FRAME)) {
        const f = e[sdKeys.ANIMATION_FRAME];

        if (Object.prototype.hasOwnProperty.call(f, sdKeys.WIDTH)) {
          frameDiv.css(Config.cssProperties.WIDTH, f[sdKeys.WIDTH]);
        }
        if (Object.prototype.hasOwnProperty.call(f, sdKeys.HEIGHT)) {
          frameDiv.css(Config.cssProperties.HEIGHT, f[sdKeys.HEIGHT]);
        }
      }
    }

    frameDiv.appendTo(this.frames.outer);
    this.frames.animation = frameDiv;
  }

  createOuterFrame(AC = this.appCtx) {
    const cls = Config.cssClasses;
    const sdKeys = Config.setupDataKeys;

    const frameDiv = AC.domFactory.createHtmlDiv(cls.CSMV_OUTER_FRAME);
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
          verboseTypeForError, AC = this.appCtx) {

    if (Object.prototype.hasOwnProperty.call(this.setupData, setupDataKey)) {
      const d = this.setupData[setupDataKey];

      if (!AC.stringUtils.isNonEmptyString(d)) {
        throw AC.errorFactory.forIncorrectSetupData(
                  `Visualization '${this.name}' has an invalid ${verboseTypeForError}; ` +
                  "it must be a string that contains not only whitespace.");
      }

      const content = $.trim(d);
      const contentDiv = AC.domFactory.createHtmlDiv(cssClass);
      contentDiv.text(content);
      contentDiv.appendTo(parent);
      this[dataKeyForThis] = content;
      this[divKeyForThis] = contentDiv;
    }
  }

  emitInitializationBeginsEvent() {
    this.emitEvent(Config.eventNames.INITIALIZATION_BEGINS, [this.name,]);
  }

  emitUIInitializationBeginsEvent() {
    this.emitEvent(Config.eventNames.UI_INITIALIZATION_BEGINS, [this.name,]);
  }

  emitUIInitializationFinishedEvent() {
    this.emitEvent(Config.eventNames.UI_INITIALIZATION_FINISHED, [this.name,]);
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

  get options() {
    return this.model.options;
  }

}
