(function() {
  'use strict';

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.config = {
    application: {
      NAME:                           "Client-Server Messaging Visualizer",
    },

    cssClasses: {
      CSMV_VISUALIZATION:             "csmv-visualization",
      CSMV_OUTER_FRAME:               "csmv-outer-frame",
      CSMV_VIS_TITLE:                 "csmv-visualization-title",
      CSMV_VIS_DESCRIPTION:           "csmv-visualization-description",
      CSMV_ANIMATION_FRAME:           "csmv-animation-frame",
      CSMV_CONTROL_FRAME:             "csmv-control-frame",
      CSMV_BUTTON:                    "csmv-button",
      CSMV_BUTTON_TO_FIRST_STEP:      "csmv-button-first-step",
      CSMV_BUTTON_TO_PREVIOUS_STEP:   "csmv-button-previous-step",
      CSMV_BUTTON_TO_NEXT_STEP:       "csmv-button-next-step",
      CSMV_BUTTON_TO_LAST_STEP:       "csmv-button-last-step",
      CSMV_ENABLED:                   "csmv-enabled",
      CSMV_DISABLED:                  "csmv-disabled",
    },

    cssProperties: {
      WIDTH:                          "width",
      HEIGHT:                         "height",
    },

    eventNames: {
      INITIALIZATION_BEGINS:          "CSMesVis-initialization-begins",
      INITIALIZATION_FINISHED:        "CSMesVis-initialization-finished",
      TO_FIRST_STEP_CLICKED:          "CSMesVis-to-first-step-button-clicked",
      TO_PREVIOUS_STEP_CLICKED:       "CSMesVis-to-previous-step-button-clicked",
      TO_NEXT_STEP_CLICKED:           "CSMesVis-to-next-step-button-clicked",
      TO_LAST_STEP_CLICKED:           "CSMesVis-to-last-step-button-clicked",
      MODEL_CHANGED:                  "CSMesVis-model-changed",
    },

    htmlAttributes: {
      VISUALIZATION_NAME:             "cmsv-name",
      CLASS:                          "class",
      DISABLED:                       "disabled",
    },

    htmlTags: {
      TAG_START:                      "<",
      SINGLE_TAG_END:                 "/>",
      DIV:                            "div",
      BUTTON:                         "button",
    },

    loggingKeys: {
      METADATA:                       "Metadata",
      INITIALIZATION_BEGINS:          "Initialization begins",
      INITIALIZATION_FINISHED:        "Initialization finished",
      TO_FIRST_STEP_CLICKED:          "'First' button clicked",
      TO_PREVIOUS_STEP_CLICKED:       "'Previous' button clicked",
      TO_NEXT_STEP_CLICKED:           "'Next' button clicked",
      TO_LAST_STEP_CLICKED:           "'Last' button clicked",
    },

    setupDataKeys: {
      VIS_NAME:                       "name",
      VIS_TITLE:                      "title",
      VIS_DESCRIPTION:                "description",
      VIS_ENV:                        "environment",
      VIS_ANIMATION_FRAME:            "animationFrame",
      WIDTH:                          "width",
      HEIGHT:                         "height",
      BUTTONS:                        "buttons",
      TO_FIRST_STEP_TITLE:            "toFirstStepTitle",
      TO_PREVIOUS_STEP_TITLE:         "toPreviousStepTitle",
      TO_NEXT_STEP_TITLE:             "toNextStepTitle",
      TO_LAST_STEP_TITLE:             "toLastStepTitle",
      VIS_ACTORS:                     "actors",
    },

    uiTexts: {
      TO_FIRST_STEP_TITLE:            "First Step",
      TO_PREVIOUS_STEP_TITLE:         "Previous Step",
      TO_NEXT_STEP_TITLE:             "Next Step",
      TO_LAST_STEP_TITLE:             "Last Step",
    }
  };

  // Create a convenience constant that contains all event keys.
  const names = CSMesVis.config.eventNames;
  var allEvents = "";
  for (const n in names) {
    allEvents = allEvents + " " + names[n];
  }
  names.ALL_EVENTS = allEvents.substring(0, allEvents.length);
}());





(function($) {
  'use strict';

  const CSMesVisModel = function(ui, setupData, log, helper) {
    this.ui = ui;
    this.name = setupData.name;
    this.log = log;
    this.helper = helper;
    this.actors = {};
    this.steps = [];
    this.currentStep = 1;
    
    this.setupModel(setupData);
  }

  CSMesVisModel.prototype.setupModel = function(setupData) {
    setupData.steps.forEach(function(step, idx) {
      this.steps.push(step);
    }, this);

    this.currentStep = 1;
    console.log(this.steps);
    this.emitModelChangedEvent();
  }  

  CSMesVisModel.prototype.moveToFirstStep = function() {
    if (!this.canMoveToFirstStep()) {
      const msg = "CSMesVis Model: Cannot move to the first step while already being there.";
      throw new CSMesVis.Error(msg);
    }

    this.currentStep = 1;
    this.emitModelChangedEvent();
  }

  CSMesVisModel.prototype.canMoveToFirstStep = function() {
    return this.steps.length > 1 & this.currentStep > 1;
  }

  CSMesVisModel.prototype.moveToPreviousStep = function() {
    if (!this.canMoveToPreviousStep()) {
      const msg = "CSMesVis Model: Cannot move to the previous step while already being in the last one.";
      throw new CSMesVis.Error(msg);
    }

    this.currentStep = this.currentStep - 1;
    this.emitModelChangedEvent();
  }

  CSMesVisModel.prototype.canMoveToPreviousStep = function() {
    return this.steps.length > 1 & this.currentStep > 1;
  }

  CSMesVisModel.prototype.moveToNextStep = function() {
    if (!this.canMoveToNextStep()) {
      const msg = "CSMesVis Model: Cannot move to the next step while already being in the last one.";
      throw new CSMesVis.Error(msg);
    }

    this.currentStep = this.currentStep + 1;
    this.emitModelChangedEvent();
  }

  CSMesVisModel.prototype.canMoveToNextStep = function() {
    return this.steps.length > 1 & this.currentStep < this.steps.length;
  }

  CSMesVisModel.prototype.moveToLastStep = function() {
    if (!this.canMoveToLastStep()) {
      const msg = "CSMesVis Model: Cannot move to the last step while already being there.";
      throw new CSMesVis.Error(msg);
    }
    
    this.currentStep = this.steps.length;
    this.emitModelChangedEvent();
  }

  CSMesVisModel.prototype.canMoveToLastStep = function() {
    return this.steps.length > 1 & this.currentStep < this.steps.length;
  }

  CSMesVisModel.prototype.emitModelChangedEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.MODEL_CHANGED, [this.name]);
  }

  CSMesVisModel.prototype.emitEvent = function(id, params) {
    const e = jQuery.Event(id);
    $(this).trigger(e, params);
  }

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Model = CSMesVisModel;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisUI = function(container, setupData, helper) {
    this.container = container;
    this.setupData = setupData;
    this.name = setupData.name;
    this.helper = helper;
    this.frames = {};
    this.buttons = {};
    this.log = new CSMesVis.Logger(this.name, helper);
    this.model = new CSMesVis.Model(this, setupData, this.log, helper);
  }

  CSMesVisUI.prototype.init = function() {
    this.emitInitializationBeginsEvent();
    this.log.addInitializationBeginsEvent();

    this.createOuterFrame();
    this.createAnimationFrame();
    this.createControlFrame();

    // The UI listens change events from the model to update itself
    $(this.model).bind(
            CSMesVis.config.eventNames.MODEL_CHANGED,
            $.proxy(this.update, this));

    this.update();

    this.emitInitializationFinishedEvent();
    this.log.addInitializationFinishedEvent();
  }

  CSMesVisUI.prototype.createControlFrame = function() {
    const conf = CSMesVis.config;
    const uiTexts = conf.uiTexts;
  
    var toFirstStepTitle = uiTexts.TO_FIRST_STEP_TITLE;
    var toPreviousStepTitle = uiTexts.TO_PREVIOUS_STEP_TITLE;
    var toNextStepTitle = uiTexts.TO_NEXT_STEP_TITLE;
    var toLastStepTitle = uiTexts.TO_LAST_STEP_TITLE;

    const sdKeys = conf.setupDataKeys;
    if (this.setupData.hasOwnProperty(sdKeys.VIS_ENV)) {
      const e = this.setupData[sdKeys.VIS_ENV];

      if (e.hasOwnProperty(sdKeys.BUTTONS)) {
        const b = e[sdKeys.BUTTONS];

        if (b.hasOwnProperty(sdKeys.TO_FIRST_STEP_TITLE)) {
          toFirstStepTitle = b[sdKeys.TO_FIRST_STEP_TITLE];
        }
        if (b.hasOwnProperty(sdKeys.TO_PREVIOUS_STEP_TITLE)) {
          toPreviousStepTitle = b[sdKeys.TO_PREVIOUS_STEP_TITLE];
        }
        if (b.hasOwnProperty(sdKeys.TO_NEXT_STEP_TITLE)) {
          toNextStepTitle = b[sdKeys.TO_NEXT_STEP_TITLE];
        }
        if (b.hasOwnProperty(sdKeys.TO_LAST_STEP_TITLE)) {
          toLastStepTitle = b[sdKeys.TO_LAST_STEP_TITLE];
        }
      }
    }

    const cssClasses = conf.cssClasses;
    const frame = this.helper.createHtmlDiv(cssClasses.CSMV_CONTROL_FRAME);
    frame.appendTo(this.frames.outer);
    this.frames.control = frame;

    this.buttons.toFirstStep = this.createButton(
          toFirstStepTitle,
          cssClasses.CSMV_BUTTON_TO_FIRST_STEP,
          this.handleToFirstStepClick,
          frame);

    this.buttons.toPreviousStep = this.createButton(
          toPreviousStepTitle,
          cssClasses.CSMV_BUTTON_TO_PREVIOUS_STEP,
          this.handleToPreviousStepClick,
          frame);

    this.buttons.toNextStep = this.createButton(
          toNextStepTitle,
          cssClasses.CSMV_BUTTON_TO_NEXT_STEP,
          this.handleToNextStepClick,
          frame);

    this.buttons.toLastStep = this.createButton(
          toLastStepTitle,
          cssClasses.CSMV_BUTTON_TO_LAST_STEP,
          this.handleToLastStepClick,
          frame);
  }

  CSMesVisUI.prototype.update = function() {
    this.updateButtonStates();
  }
  
  CSMesVisUI.prototype.updateButtonStates = function() {
    const btns = this.buttons;
    const mdl = this.model;
    
    this.updateButtonState(btns.toFirstStep, mdl.canMoveToFirstStep());
    this.updateButtonState(btns.toPreviousStep, mdl.canMoveToPreviousStep());
    this.updateButtonState(btns.toNextStep, mdl.canMoveToNextStep());
    this.updateButtonState(btns.toLastStep, mdl.canMoveToLastStep());
  }

  CSMesVisUI.prototype.updateButtonState = function(button, isEnabled) {
    const b = $(button);
    const conf = CSMesVis.config;
    const cssClasses = conf.cssClasses;

    b.attr(conf.htmlAttributes.DISABLED, !isEnabled);
    
    if (isEnabled) {
      b.addClass(cssClasses.CSMV_ENABLED);
      b.removeClass(cssClasses.CSMV_DISABLED);
    }
    else {
      b.removeClass(cssClasses.CSMV_ENABLED);
      b.addClass(cssClasses.CSMV_DISABLED);
      b.blur();
    }
  }
  
  CSMesVisUI.prototype.handleToFirstStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToFirstStep();

    this.emitToFirstStepButtonClickedEvent();
    this.log.addToFirstClickedEvent();
  }

  CSMesVisUI.prototype.handleToPreviousStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToPreviousStep();

    this.emitToPreviousStepButtonClickedEvent();
    this.log.addToPreviousClickedEvent();
  }

  CSMesVisUI.prototype.handleToNextStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToNextStep();

    this.emitToNextStepButtonClickedEvent();
    this.log.addToNextClickedEvent();
  }

  CSMesVisUI.prototype.handleToLastStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.moveToLastStep();

    this.emitToLastStepButtonClickedEvent();
    this.log.addToLastClickedEvent();
    console.log(this.log.get());
  }

  CSMesVisUI.prototype.createButton = function(title, cssClass, clickHandler, parent) {
    const b = this.helper.createHtmlButton(CSMesVis.config.cssClasses.CSMV_BUTTON);
    b.text(title);
    if (this.helper.isNonEmptyString(cssClass)) {
      b.addClass(cssClass);
    }
    b.click($.proxy(clickHandler, this));
    b.appendTo(parent);
    return b;
  }

  CSMesVisUI.prototype.createAnimationFrame = function() {
    const conf = CSMesVis.config;
    const frameDiv = this.helper.createHtmlDiv(
              conf.cssClasses.CSMV_ANIMATION_FRAME);

    const sdKeys = conf.setupDataKeys;
    if (this.setupData.hasOwnProperty(sdKeys.VIS_ENV)) {
      const e = this.setupData[sdKeys.VIS_ENV];

      if (e.hasOwnProperty(sdKeys.VIS_ANIMATION_FRAME)) {
        const f = e[sdKeys.VIS_ANIMATION_FRAME];

        if (f.hasOwnProperty(sdKeys.WIDTH)) {
          frameDiv.css(conf.cssProperties.WIDTH, f[sdKeys.WIDTH]);
        }
        if (f.hasOwnProperty(conf.setupDataKeys.HEIGHT)) {
          frameDiv.css(conf.cssProperties.HEIGHT, f[sdKeys.HEIGHT]);
        }
      }
    }

    frameDiv.appendTo(this.frames.outer);
    this.frames.animation = frameDiv;
  }

  CSMesVisUI.prototype.createOuterFrame = function() {
    const conf = CSMesVis.config;
    const frameDiv = this.helper.createHtmlDiv(conf.cssClasses.CSMV_OUTER_FRAME);
    frameDiv.appendTo(this.container);
    this.frames.outer = frameDiv;

    const sdKeys = conf.setupDataKeys;
    if (this.setupData.hasOwnProperty(sdKeys.VIS_TITLE)) {
      const t = this.setupData[sdKeys.VIS_TITLE];
      if (this.helper.isNonEmptyString(t)) {
        const title = $.trim(t);
        const titleDiv = this.helper.createHtmlDiv(conf.cssClasses.CSMV_VIS_TITLE);
        titleDiv.text(title);
        titleDiv.appendTo(frameDiv);
        this.title = title;
        this.titleDiv = titleDiv;
      }
      else {
        const msg = "Visualization '" + this.name + "' has an invalid title; " +
                    "it must be a string that contains not only whitespace.";
        throw new CSMesVisError(this.helper.incorrectSetupDataMessage(msg));
      }
    }

    if (this.setupData.hasOwnProperty(sdKeys.VIS_DESCRIPTION)) {
      const d = this.setupData[sdKeys.VIS_DESCRIPTION];
      if (this.helper.isNonEmptyString(d)) {
        const desc = $.trim(d);
        const descDiv = this.helper.createHtmlDiv(conf.cssClasses.CSMV_VIS_DESCRIPTION);
        descDiv.text(desc);
        descDiv.appendTo(frameDiv);
        this.description = desc;
        this.descriptionDiv = descDiv;
      }
      else {
        const msg = "Visualization '" + this.name + "' has an invalid description; " +
                    "it must be a string that contains not only whitespace.";
        throw new CSMesVisError(this.helper.incorrectSetupDataMessage(msg));
      }
    }
  }

  CSMesVisUI.prototype.emitInitializationBeginsEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.INITIALIZATION_BEGINS, [this.name]);
  }

  CSMesVisUI.prototype.emitInitializationFinishedEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.INITIALIZATION_FINISHED, [this.name]);
  }

  CSMesVisUI.prototype.emitToFirstStepButtonClickedEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.TO_FIRST_STEP_CLICKED, [this.name]);
  }

  CSMesVisUI.prototype.emitToPreviousStepButtonClickedEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.TO_PREVIOUS_STEP_CLICKED, [this.name]);
  }

  CSMesVisUI.prototype.emitToNextStepButtonClickedEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.TO_NEXT_STEP_CLICKED, [this.name]);
  }

  CSMesVisUI.prototype.emitToLastStepButtonClickedEvent = function() {
    this.emitEvent(CSMesVis.config.eventNames.TO_LAST_STEP_CLICKED, [this.name]);
  }

  CSMesVisUI.prototype.emitEvent = function(id, params) {
    const e = jQuery.Event(id);
    $(this.container).trigger(e, params);
  }

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.UI = CSMesVisUI;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisLogger = function(visualizationName, helper) {
    this.helper = helper;
    this.log = [];

    this.add(CSMesVis.config.loggingKeys.METADATA, {
      webPage: {
        location: {
          url:            helper.documentURL,
          /*
          protocol:       helper.locationProtocol,
          host:           helper.locationHost,
          hostname:       helper.locationHostname,
          port:           helper.locationPort,
          pathname:       helper.locationPathname,
          hash:           helper.locationHash,
          query:          helper.locationQuery,
          */
        },
        referrer:         helper.documentReferrer,
        title:            helper.documentTitle,
        charSet:          helper.documentCharacterSet,
      },
      navigator: {
        userAgent:        helper.userAgent,
        platform:         helper.platform,
        appName:          helper.appName,
        appVersion:       helper.appVersion,
        product:          helper.product,
      },
      screen: {
        totalHeight:      helper.totalScreenHeight,
        totalWidth:       helper.totalScreenWidth,
        colorDepth:       helper.colorDepth,
      },
      visualization: {
        name:             visualizationName,
      },
    });
  }

  CSMesVisLogger.prototype.addInitializationBeginsEvent = function() {
    this.add(CSMesVis.config.loggingKeys.INITIALIZATION_BEGINS);
  }

  CSMesVisLogger.prototype.addInitializationFinishedEvent = function() {
    this.add(CSMesVis.config.loggingKeys.INITIALIZATION_FINISHED);
  }

  CSMesVisLogger.prototype.addToFirstClickedEvent = function() {
    this.add(CSMesVis.config.loggingKeys.TO_FIRST_STEP_CLICKED);
  }

  CSMesVisLogger.prototype.addToPreviousClickedEvent = function() {
    this.add(CSMesVis.config.loggingKeys.TO_PREVIOUS_STEP_CLICKED);
  }

  CSMesVisLogger.prototype.addToNextClickedEvent = function() {
    this.add(CSMesVis.config.loggingKeys.TO_NEXT_STEP_CLICKED);
  }

  CSMesVisLogger.prototype.addToLastClickedEvent = function() {
    this.add(CSMesVis.config.loggingKeys.TO_LAST_STEP_CLICKED);
  }

  CSMesVisLogger.prototype.add = function(type, data) {
    const timestamp = Date.now();
    const timezoneOffset = new Date(timestamp).getTimezoneOffset();
    const logEntry = [timestamp, timezoneOffset, type];

    if (arguments.length == 2) {
      if ($.isArray(data)) {
        data.forEach(function(item, idx) {
          logEntry.push(item);
        });
      }
      else {
        logEntry.push(data);
      }
    }

    this.log.push(logEntry);
  }

  CSMesVisLogger.prototype.get = function() {
    return this.log;
  }

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Logger = CSMesVisLogger;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisHelpers = function() {
    this.totalScreenHeight = screen.height;
    this.totalScreenWidth = screen.width;
    this.colorDepth = screen.colorDepth;
    this.userAgent = navigator.userAgent;
    this.platform = navigator.platform;
    this.appName = navigator.appName;
    this.appVersion = navigator.appVersion;
    this.product = navigator.product;
    this.documentTitle = document.title;
    this.documentReferrer = document.referrer;
    this.documentCharacterSet = document.characterSet;
    this.documentURL = document.URL;
    this.locationProtocol = window.location.protocol;
    this.locationHost = window.location.host;
    this.locationHostname = window.location.hostname;
    this.locationPort = window.location.port;
    this.locationPathname = window.location.pathname;
    this.locationHash = window.location.hash;
    this.locationQuery = window.location.search;
  }

  CSMesVisHelpers.prototype.createHtmlDiv = function(cssClass) {
    return this.createHtmlTag(CSMesVis.config.htmlTags.DIV, cssClass);
  }

  CSMesVisHelpers.prototype.createHtmlButton = function(cssClass) {
    return this.createHtmlTag(CSMesVis.config.htmlTags.BUTTON, cssClass);
  }

  CSMesVisHelpers.prototype.createHtmlTag = function(tagName, cssClass) {
    const conf = CSMesVis.config;
    const tag = conf.htmlTags.TAG_START + tagName + conf.htmlTags.SINGLE_TAG_END;
    const attributes = {};
    attributes[conf.htmlAttributes.CLASS] = cssClass;
    return $(tag, attributes);
  }

  CSMesVisHelpers.prototype.incorrectSetupDataMessage = function(message) {
    return "Incorrect setup data: " + message;
  }

  CSMesVisHelpers.prototype.incorrectSetupMessage = function(message) {
    return "Incorrect setup: " + message;
  }

  CSMesVisHelpers.prototype.isNonEmptyString = function(s) {
    return $.type(s) === "string" && $.trim(s).length > 0;
  }

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Helper = CSMesVisHelpers;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisError = function(message) {
    this.message = this.formatErrorMessage(message);
  }

  CSMesVisError.prototype = new Error();

  CSMesVisError.prototype.formatErrorMessage = function(message) {
    return this.ensureThatEndsWithPeriod(
            CSMesVis.config.application.NAME + ": " + message);
  }

  CSMesVisError.prototype.ensureThatEndsWithPeriod = function(s) {
    return !s.endsWith(".") ? s + "." : s;
  }

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Error = CSMesVisError;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisBootstrapper = function() {
    // Nothing
  }

  CSMesVisBootstrapper.prototype.execute = function() {
    const helper = new CSMesVis.Helper();

    if (CSMesVis.setupData == null) {
      throw new CSMesVis.Error("Configuration using CSMesVis.setupData is missing.");
    }
    if (!Array.isArray(CSMesVis.setupData)) {
      const msg = "The root element must be an array.";
      throw new CSMesVis.Error(helper.incorrectSetupDataMessage(msg));
    }

    const allVisualizationElements = $("." + CSMesVis.config.cssClasses.CSMV_VISUALIZATION);
    if (allVisualizationElements.length != CSMesVis.setupData.length) {
      const msg = "There are " + allVisualizationElements.length +
                  " visualization(s) in the HTML file but setup data is given for " +
                  CSMesVis.setupData.length + " visualiation(s).";

      // TODO: Print lists of names of both the existing divs and setups

      throw new CSMesVis.Error(helper.incorrectSetupDataMessage(msg));
    }

    CSMesVis.setupData.forEach(function(visualizationSetup, idx) {
      if (!visualizationSetup.hasOwnProperty(CSMesVis.config.setupDataKeys.VIS_NAME)) {
        const msg = (idx + 1) + ". visualization does not have a name.";
        throw new CSMesVis.Error(helper.incorrectSetupDataMessage(msg));
      }

      // TODO: Is the name a non-empty string? if (helper.isNonEmptyString(t)) {

      // console.log(visualizationSetup.name);

      const visualizationElements =
              $("." + CSMesVis.config.cssClasses.CSMV_VISUALIZATION +
              "[" + CSMesVis.config.htmlAttributes.VISUALIZATION_NAME + "='" +
              visualizationSetup.name + "']");

      if (visualizationElements.length === 0) {
        const msg = "Setup data is given for visualization '" +  visualizationSetup.name +
                    "', but the HTML file does not contain a container element for it.";
        throw new CSMesVis.Error(helper.incorrectSetupMessage(msg));
      }
      if (visualizationElements.length > 1) {
        const msg = "The HTML file contains multiple container element for visualization '" +
                    visualizationSetup.name + "'."
        throw new CSMesVis.Error(helper.incorrectSetupMessage(msg));
      }
      const visualizationContainer = visualizationElements[0];
      //console.log(visualizationContainer);

      const V = new CSMesVis.UI(visualizationContainer, visualizationSetup, helper);
      V.init();
    }, this);
  }

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.Bootstrapper = CSMesVisBootstrapper;
}(jQuery));

$(document).ready(function() {
  (new CSMesVis.Bootstrapper()).execute();
});
