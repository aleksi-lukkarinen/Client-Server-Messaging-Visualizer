import * as Config from "./Config.js";




(function($) {
  'use strict';

  const CSMesVisModel = function(ui, setupData, log) {
    this.ui = ui;
    this.name = setupData.name;
    this.log = log;
    this.actors = {};
    this.steps = [];
    this.currentStep = 1;

    this.setupModel(setupData);
  };

  CSMesVisModel.prototype.setupModel = function(setupData) {
    setupData.steps.forEach(function(step) {
      this.steps.push(step);
    }, this);

    this.currentStep = 1;
    console.log(this.steps);
    this.emitModelChangedEvent();
  };

  CSMesVisModel.prototype.moveToFirstStep = function() {
    if (!this.canMoveToFirstStep()) {
      const msg = "CSMesVis Model: Cannot move to the first step while already being there.";
      throw Helpers.newCSMVError(msg);
    }

    this.currentStep = 1;
    this.emitModelChangedEvent();
  };

  CSMesVisModel.prototype.canMoveToFirstStep = function() {
    return this.steps.length > 1 & this.currentStep > 1;
  };

  CSMesVisModel.prototype.moveToPreviousStep = function() {
    if (!this.canMoveToPreviousStep()) {
      const msg = "CSMesVis Model: Cannot move to the previous step while already being in the first one.";
      throw Helpers.newCSMVError(msg);
    }

    this.currentStep = this.currentStep - 1;
    this.emitModelChangedEvent();
  };

  CSMesVisModel.prototype.canMoveToPreviousStep = function() {
    return this.steps.length > 1 & this.currentStep > 1;
  };

  CSMesVisModel.prototype.moveToNextStep = function() {
    if (!this.canMoveToNextStep()) {
      const msg = "CSMesVis Model: Cannot move to the next step while already being in the last one.";
      throw Helpers.newCSMVError(msg);
    }

    this.currentStep = this.currentStep + 1;
    this.emitModelChangedEvent();
  };

  CSMesVisModel.prototype.canMoveToNextStep = function() {
    return this.steps.length > 1 & this.currentStep < this.steps.length;
  };

  CSMesVisModel.prototype.moveToLastStep = function() {
    if (!this.canMoveToLastStep()) {
      const msg = "CSMesVis Model: Cannot move to the last step while already being there.";
      throw Helpers.newCSMVError(msg);
    }

    this.currentStep = this.steps.length;
    this.emitModelChangedEvent();
  };

  CSMesVisModel.prototype.canMoveToLastStep = function() {
    return this.steps.length > 1 & this.currentStep < this.steps.length;
  };

  CSMesVisModel.prototype.emitModelChangedEvent = function() {
    this.emitEvent(Config.eventNames.MODEL_CHANGED, [this.name,]);
  };

  CSMesVisModel.prototype.emitEvent = function(id, params) {
    const e = jQuery.Event(id);
    $(this).trigger(e, params);
  };

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Model = CSMesVisModel;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisUI = function(container, setupData) {
    this.container = container;
    this.setupData = setupData;
    this.name = setupData.name;
    this.frames = {};
    this.buttons = {};
    this.log = new CSMesVis.Logger(this.name);
    this.model = new CSMesVis.Model(this, setupData, this.log);
  };

  CSMesVisUI.prototype.init = function() {
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
  };

  CSMesVisUI.prototype.createControlFrame = function() {
    const frame = Helpers.createHtmlDiv(Config.cssClasses.CSMV_CONTROL_FRAME);
    frame.appendTo(this.frames.outer);
    this.frames.control = frame;

    this.createButton("toFirstStep",
          Config.uiTexts.TO_FIRST_STEP_TITLE, Config.setupDataKeys.TO_FIRST_STEP_TITLE,
          Config.cssClasses.CSMV_BUTTON_TO_FIRST_STEP,
          this.handleToFirstStepClick, frame);

    this.createButton("toPreviousStep",
          Config.uiTexts.TO_PREVIOUS_STEP_TITLE, Config.setupDataKeys.TO_PREVIOUS_STEP_TITLE,
          Config.cssClasses.CSMV_BUTTON_TO_PREVIOUS_STEP,
          this.handleToPreviousStepClick, frame);

    this.createButton("toNextStep",
          Config.uiTexts.TO_NEXT_STEP_TITLE, Config.setupDataKeys.TO_NEXT_STEP_TITLE,
          Config.cssClasses.CSMV_BUTTON_TO_NEXT_STEP,
          this.handleToNextStepClick, frame);

    this.createButton("toLastStep",
          Config.uiTexts.TO_LAST_STEP_TITLE, Config.setupDataKeys.TO_LAST_STEP_TITLE,
          Config.cssClasses.CSMV_BUTTON_TO_LAST_STEP,
          this.handleToLastStepClick, frame);
  };

  CSMesVisUI.prototype.createButton = function(
                collectionName, defaultTitle, setupDataKeyForTitle,
                cssClass, clickHandler, parent) {

    const conf = CSMesVis.config;

    let title = defaultTitle;
    if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_ENV)) {
      const env = this.setupData[Config.setupDataKeys.VIS_ENV];

      if (env.hasOwnProperty(Config.setupDataKeys.BUTTONS)) {
        const btns = env[Config.setupDataKeys.BUTTONS];

        if (btns.hasOwnProperty(setupDataKeyForTitle)) {
          title = btns[setupDataKeyForTitle];
        }
      }
    }

    const b = Helpers.createHtmlButton(
                Config.cssClasses.CSMV_BUTTON);
    b.text(title);

    if (StringUtils.isNonEmptyString(cssClass)) {
      b.addClass(cssClass);
    }

    b.click($.proxy(clickHandler, this));
    b.appendTo(parent);
    this.buttons[collectionName] = b;
  };

  CSMesVisUI.prototype.update = function() {
    this.updateButtonStates();
  };

  CSMesVisUI.prototype.updateButtonStates = function() {
    const btns = this.buttons;
    const mdl = this.model;

    this.updateButtonState(btns.toFirstStep, mdl.canMoveToFirstStep());
    this.updateButtonState(btns.toPreviousStep, mdl.canMoveToPreviousStep());
    this.updateButtonState(btns.toNextStep, mdl.canMoveToNextStep());
    this.updateButtonState(btns.toLastStep, mdl.canMoveToLastStep());
  };

  CSMesVisUI.prototype.updateButtonState = function(button, isEnabled) {
    const b = $(button);

    b.attr(Config.htmlAttributes.DISABLED, !isEnabled);

    if (isEnabled) {
      b.addClass(Config.cssClasses.CSMV_ENABLED);
      b.removeClass(Config.cssClasses.CSMV_DISABLED);
    }
    else {
      b.removeClass(Config.cssClasses.CSMV_ENABLED);
      b.addClass(Config.cssClasses.CSMV_DISABLED);
      b.blur();
    }
  };

  CSMesVisUI.prototype.handleToFirstStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToFirstStep();

    this.emitToFirstStepButtonClickedEvent();
    this.log.addToFirstClickedEvent();
  };

  CSMesVisUI.prototype.handleToPreviousStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToPreviousStep();

    this.emitToPreviousStepButtonClickedEvent();
    this.log.addToPreviousClickedEvent();
  };

  CSMesVisUI.prototype.handleToNextStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToNextStep();

    this.emitToNextStepButtonClickedEvent();
    this.log.addToNextClickedEvent();
  };

  CSMesVisUI.prototype.handleToLastStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToLastStep();

    this.emitToLastStepButtonClickedEvent();
    this.log.addToLastClickedEvent();
    console.log(this.log.get());
  };

  CSMesVisUI.prototype.createAnimationFrame = function() {
    const frameDiv = Helpers.createHtmlDiv(
              Config.cssClasses.CSMV_ANIMATION_FRAME);

    if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_ENV)) {
      const e = this.setupData[Config.setupDataKeys.VIS_ENV];

      if (e.hasOwnProperty(Config.setupDataKeys.VIS_ANIMATION_FRAME)) {
        const f = e[Config.setupDataKeys.VIS_ANIMATION_FRAME];

        if (f.hasOwnProperty(Config.setupDataKeys.WIDTH)) {
          frameDiv.css(Config.cssProperties.WIDTH, f[Config.setupDataKeys.WIDTH]);
        }
        if (f.hasOwnProperty(Config.setupDataKeys.HEIGHT)) {
          frameDiv.css(Config.cssProperties.HEIGHT, f[Config.setupDataKeys.HEIGHT]);
        }
      }
    }

    frameDiv.appendTo(this.frames.outer);
    this.frames.animation = frameDiv;
  };

  CSMesVisUI.prototype.createOuterFrame = function() {
    const conf = CSMesVis.config;
    const frameDiv = Helpers.createHtmlDiv(Config.cssClasses.CSMV_OUTER_FRAME);
    frameDiv.appendTo(this.container);
    this.frames.outer = frameDiv;

    if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_TITLE)) {
      const t = this.setupData[Config.setupDataKeys.VIS_TITLE];
      if (StringUtils.isNonEmptyString(t)) {
        const title = $.trim(t);
        const titleDiv = Helpers.createHtmlDiv(Config.cssClasses.CSMV_VIS_TITLE);
        titleDiv.text(title);
        titleDiv.appendTo(frameDiv);
        this.title = title;
        this.titleDiv = titleDiv;
      }
      else {
        const msg = `Visualization '${this.name}' has an invalid title; ` +
                    `it must be a string that contains not only whitespace.`;
        throw Helpers.incorrectSetupDataError(msg);
      }
    }

    if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_DESCRIPTION)) {
      const d = this.setupData[Config.setupDataKeys.VIS_DESCRIPTION];
      if (StringUtils.isNonEmptyString(d)) {
        const desc = $.trim(d);
        const descDiv = Helpers.createHtmlDiv(Config.cssClasses.CSMV_VIS_DESCRIPTION);
        descDiv.text(desc);
        descDiv.appendTo(frameDiv);
        this.description = desc;
        this.descriptionDiv = descDiv;
      }
      else {
        const msg = `Visualization '${this.name}' has an invalid description; ` +
                    `it must be a string that contains not only whitespace.`;
        throw Helpers.incorrectSetupDataError(msg);
      }
    }
  };

  CSMesVisUI.prototype.emitInitializationBeginsEvent = function() {
    this.emitEvent(Config.eventNames.INITIALIZATION_BEGINS, [this.name,]);
  };

  CSMesVisUI.prototype.emitInitializationFinishedEvent = function() {
    this.emitEvent(Config.eventNames.INITIALIZATION_FINISHED, [this.name,]);
  };

  CSMesVisUI.prototype.emitToFirstStepButtonClickedEvent = function() {
    this.emitEvent(Config.eventNames.TO_FIRST_STEP_CLICKED, [this.name,]);
  };

  CSMesVisUI.prototype.emitToPreviousStepButtonClickedEvent = function() {
    this.emitEvent(Config.eventNames.TO_PREVIOUS_STEP_CLICKED, [this.name,]);
  };

  CSMesVisUI.prototype.emitToNextStepButtonClickedEvent = function() {
    this.emitEvent(Config.eventNames.TO_NEXT_STEP_CLICKED, [this.name,]);
  };

  CSMesVisUI.prototype.emitToLastStepButtonClickedEvent = function() {
    this.emitEvent(Config.eventNames.TO_LAST_STEP_CLICKED, [this.name,]);
  };

  CSMesVisUI.prototype.emitEvent = function(id, params) {
    const e = jQuery.Event(id);
    $(this.container).trigger(e, params);
  };

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.UI = CSMesVisUI;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisLogger = function(visualizationName) {
    this.log = [];

    this.add(Config.loggingKeys.METADATA, {
      webPage: {
        location: {
          url:            Helpers.documentURL,
          /*
          protocol:       Helpers.locationProtocol,
          host:           Helpers.locationHost,
          hostname:       Helpers.locationHostname,
          port:           Helpers.locationPort,
          pathname:       Helpers.locationPathname,
          hash:           Helpers.locationHash,
          query:          Helpers.locationQuery,
          */
        },
        referrer:         Helpers.documentReferrer,
        title:            Helpers.documentTitle,
        charSet:          Helpers.documentCharacterSet,
      },
      navigator: {
        userAgent:        Helpers.userAgent,
        platform:         Helpers.platform,
        appName:          Helpers.appName,
        appVersion:       Helpers.appVersion,
        product:          Helpers.product,
      },
      screen: {
        totalHeight:      Helpers.totalScreenHeight,
        totalWidth:       Helpers.totalScreenWidth,
        colorDepth:       Helpers.colorDepth,
      },
      visualization: {
        name:             visualizationName,
      },
    });
  };

  CSMesVisLogger.prototype.addInitializationBeginsEvent = function() {
    this.add(Config.loggingKeys.INITIALIZATION_BEGINS);
  };

  CSMesVisLogger.prototype.addInitializationFinishedEvent = function() {
    this.add(Config.loggingKeys.INITIALIZATION_FINISHED);
  };

  CSMesVisLogger.prototype.addToFirstClickedEvent = function() {
    this.add(Config.loggingKeys.TO_FIRST_STEP_CLICKED);
  };

  CSMesVisLogger.prototype.addToPreviousClickedEvent = function() {
    this.add(Config.loggingKeys.TO_PREVIOUS_STEP_CLICKED);
  };

  CSMesVisLogger.prototype.addToNextClickedEvent = function() {
    this.add(Config.loggingKeys.TO_NEXT_STEP_CLICKED);
  };

  CSMesVisLogger.prototype.addToLastClickedEvent = function() {
    this.add(Config.loggingKeys.TO_LAST_STEP_CLICKED);
  };

  CSMesVisLogger.prototype.add = function(type, data) {
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
  };

  CSMesVisLogger.prototype.get = function() {
    return this.log;
  };

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Logger = CSMesVisLogger;
}(jQuery));




class Helpers {

  constructor() {
    this.totalScreenHeight      = screen.height;
    this.totalScreenWidth       = screen.width;
    this.colorDepth             = screen.colorDepth;
    this.userAgent              = navigator.userAgent;
    this.platform               = navigator.platform;
    this.appName                = navigator.appName;
    this.appVersion             = navigator.appVersion;
    this.product                = navigator.product;
    this.documentTitle          = document.title;
    this.documentReferrer       = document.referrer;
    this.documentCharacterSet   = document.characterSet;
    this.documentURL            = document.URL;
    this.locationProtocol       = window.location.protocol;
    this.locationHost           = window.location.host;
    this.locationHostname       = window.location.hostname;
    this.locationPort           = window.location.port;
    this.locationPathname       = window.location.pathname;
    this.locationHash           = window.location.hash;
    this.locationQuery          = window.location.search;
  }

  static createHtmlDiv(cssClass) {
    return this.createHtmlTag(Config.htmlTags.DIV, cssClass);
  }

  static createHtmlButton(cssClass) {
    return this.createHtmlTag(Config.htmlTags.BUTTON, cssClass);
  }

  static createHtmlTag(tagName, cssClass) {
    const tag = Config.htmlTags.TAG_START + tagName + Config.htmlTags.SINGLE_TAG_END;
    const attributes = {};
    attributes[Config.htmlAttributes.CLASS] = cssClass;
    return $(tag, attributes);
  }

  static incorrectSetupDataError(message) {
    return this.newCSMVError(`Incorrect setup data: ${message}`);
  }

  static incorrectSetupError(message) {
    return this.newCSMVError(`Incorrect setup: ${message}`);
  }

  static newCSMVError(message) {
    return new CSMesVis.Error(message);
  }

}




class StringUtils {

  static isNonEmptyString(s) {
    return $.type(s) === "string" && $.trim(s).length > 0;
  }

}




(function() {
  'use strict';

  const CSMesVisError = function(message) {
    this.message = this.formatErrorMessage(message);
  };

  CSMesVisError.prototype = new Error();

  CSMesVisError.prototype.formatErrorMessage = function(message) {
    return this.ensureThatEndsWithPeriod(
            Config.application.NAME + ": " + message);
  };

  CSMesVisError.prototype.ensureThatEndsWithPeriod = function(s) {
    return !s.endsWith(".") ? s + "." : s;
  };

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Error = CSMesVisError;
}());




(function($) {
  'use strict';

  const CSMesVisBootstrapper = function() {
    // Nothing
  };

  CSMesVisBootstrapper.prototype.execute = function() {
    if (CSMesVis.setupData == null) {
      throw Helpers.newCSMVError("Configuration using CSMesVis.setupData is missing.");
    }
    if (!Array.isArray(CSMesVis.setupData)) {
      const msg = "The root element must be an array.";
      throw Helpers.incorrectSetupDataError(msg);
    }

    const allVisualizationElements = $(`.${Config.cssClasses.CSMV_VISUALIZATION}`);
    if (allVisualizationElements.length != CSMesVis.setupData.length) {
      const msg = `There are ${allVisualizationElements.length} ` +
                  `visualization(s) in the HTML file but setup data is given for ` +
                  `${CSMesVis.setupData.length} visualiation(s).`;

      // TODO: Print lists of names of both the existing divs and setups

      throw Helpers.incorrectSetupDataError(msg);
    }

    CSMesVis.setupData.forEach(function(visualizationSetup, idx) {
      if (!visualizationSetup.hasOwnProperty(Config.setupDataKeys.VIS_NAME)) {
        const msg = `${idx + 1}. visualization does not have a name.`;
        throw Helpers.incorrectSetupDataError(msg);
      }

      // TODO: Is the name a non-empty string? if (StringUtils.isNonEmptyString(t)) {

      // console.log(visualizationSetup.name);

      const visualizationElements =
              $(`.${Config.cssClasses.CSMV_VISUALIZATION}` +
              `[${Config.htmlAttributes.VISUALIZATION_NAME}=` +
              `'${visualizationSetup.name}']`);

      if (visualizationElements.length === 0) {
        const msg = `Setup data is given for visualization '${visualizationSetup.name}', `+
                    `but the HTML file does not contain a container element for it.`;
        throw Helpers.incorrectSetupError(msg);
      }
      if (visualizationElements.length > 1) {
        const msg = `The HTML file contains multiple container elements for visualization ` +
                    `'${visualizationSetup.name}'.`;
        throw Helpers.incorrectSetupError(msg);
      }
      const visualizationContainer = visualizationElements[0];
      //console.log(visualizationContainer);

      const V = new CSMesVis.UI(visualizationContainer, visualizationSetup);
      V.init();
    }, this);
  };

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Bootstrapper = CSMesVisBootstrapper;
}(jQuery));

$(document).ready(function() {
  'use strict';
  (new CSMesVis.Bootstrapper()).execute();
});
