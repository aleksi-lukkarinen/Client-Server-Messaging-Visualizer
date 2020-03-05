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
    },

    cssProperties: {
      WIDTH:                          "width",
      HEIGHT:                         "height",
    },

    htmlAttributes: {
      VISUALIZATION_NAME:             "cmsv-name",
      CLASS:                          "class",
    },

    htmlTags: {
      TAG_START:                      "<",
      SINGLE_TAG_END:                 "/>",
      DIV:                            "div",
      BUTTON:                         "button",
    },

    loggingKeys: {
      METADATA:                       "Metadata",
      INITIALIZED:                    "Initialized",
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
}());




(function($) {
  'use strict';

  const CSMesVisLogger = function(visualizationName, helper) {
    this.helper = helper;
    this.log = [];

    this.add(CSMesVis.config.loggingKeys.METADATA, {
      webPage: {
        location: {
          url:        document.URL,
          protocol:   window.location.protocol,
          host:       window.location.host,
          hostname:   window.location.hostname,
          port:       window.location.port,
          pathname:   window.location.pathname,
          hash:       window.location.hash,
          query:      window.location.search,
        },
        referrer:     document.referrer,
        title:        document.title,
        charSet:      document.characterSet,
      },
      navigator: {
        userAgent:    navigator.userAgent,
        platform:     navigator.platform,
        appName:      navigator.appName,
        appVersion:   navigator.appVersion,
        product:      navigator.product,
      },
      screen: {
        totalHeight:  screen.height,
        totalWidth:   screen.width,
        colorDepth:   screen.colorDepth,
      },
      visualization: {
        name:         visualizationName,
      },
    });
  }

  CSMesVisLogger.prototype.addInitializedEvent = function() {
    this.add(CSMesVis.config.loggingKeys.INITIALIZED);
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
    const timestamp = this.helper.timestamp();
    const logEntry = [timestamp, type];
    
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

  const CSMesVisUI = function(container, setupData, helper) {
    this.container = container;
    this.setupData = setupData;
    this.name = setupData.name;
    this.helper = helper;
    this.frames = {};
    this.buttons = {};
    this.log = new CSMesVis.Logger(this.name, this.helper);
  }

  CSMesVisUI.prototype.init = function() {
    this.emitInitializationStartsEvent();
    
    this.createOuterFrame();
    this.createAnimationFrame();
    this.createControlFrame();

    this.log.addInitializedEvent();
  }

  CSMesVisUI.prototype.emitInitializationStartsEvent = function() {
    var e = jQuery.Event("InitializationStartsEvent")
  }
  
  CSMesVisUI.prototype.createControlFrame = function() {
    const conf = CSMesVis.config;
    const frame = this.helper.createHtmlDiv(conf.cssClasses.CSMV_CONTROL_FRAME);
    frame.appendTo(this.frames.outer);
    this.frames.control = frame;

    var toFirstStepTitle = conf.uiTexts.TO_FIRST_STEP_TITLE;
    var toPreviousStepTitle = conf.uiTexts.TO_PREVIOUS_STEP_TITLE;
    var toNextStepTitle = conf.uiTexts.TO_NEXT_STEP_TITLE;
    var toLastStepTitle = conf.uiTexts.TO_LAST_STEP_TITLE;

    if (this.setupData.hasOwnProperty(conf.setupDataKeys.VIS_ENV)) {
      const e = this.setupData[conf.setupDataKeys.VIS_ENV];

      if (e.hasOwnProperty(conf.setupDataKeys.BUTTONS)) {
        const b = e[conf.setupDataKeys.BUTTONS];

        if (b.hasOwnProperty(conf.setupDataKeys.TO_FIRST_STEP_TITLE)) {
          toFirstStepTitle = b[conf.setupDataKeys.TO_FIRST_STEP_TITLE];
        }
        if (b.hasOwnProperty(conf.setupDataKeys.TO_PREVIOUS_STEP_TITLE)) {
          toPreviousStepTitle = b[conf.setupDataKeys.TO_PREVIOUS_STEP_TITLE];
        }
        if (b.hasOwnProperty(conf.setupDataKeys.TO_NEXT_STEP_TITLE)) {
          toNextStepTitle = b[conf.setupDataKeys.TO_NEXT_STEP_TITLE];
        }
        if (b.hasOwnProperty(conf.setupDataKeys.TO_LAST_STEP_TITLE)) {
          toLastStepTitle = b[conf.setupDataKeys.TO_LAST_STEP_TITLE];
        }
      }
    }

    this.buttons.toFirstStep = this.createButton(
          toFirstStepTitle, 
          conf.cssClasses.CSMV_BUTTON_TO_FIRST_STEP, 
          this.handleToFirstStepClick, 
          frame);

    this.buttons.toPreviousStep = this.createButton(
          toPreviousStepTitle, 
          conf.cssClasses.CSMV_BUTTON_TO_PREVIOUS_STEP, 
          this.handleToPreviousStepClick, 
          frame);

    this.buttons.toNextStep = this.createButton(
          toNextStepTitle, 
          conf.cssClasses.CSMV_BUTTON_TO_NEXT_STEP, 
          this.handleToNextStepClick, 
          frame);

    this.buttons.toLastStep = this.createButton(
          toLastStepTitle, 
          conf.cssClasses.CSMV_BUTTON_TO_LAST_STEP, 
          this.handleToLastStepClick, 
          frame);
  }

  CSMesVisUI.prototype.handleToFirstStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.log.addToFirstClickedEvent();
  }

  CSMesVisUI.prototype.handleToPreviousStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.log.addToPreviousClickedEvent();
  }

  CSMesVisUI.prototype.handleToNextStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.log.addToNextClickedEvent();
  }

  CSMesVisUI.prototype.handleToLastStepClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    
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

    if (this.setupData.hasOwnProperty(conf.setupDataKeys.VIS_ENV)) {
      const e = this.setupData[conf.setupDataKeys.VIS_ENV];

      if (e.hasOwnProperty(conf.setupDataKeys.VIS_ANIMATION_FRAME)) {
        const f = e[conf.setupDataKeys.VIS_ANIMATION_FRAME];

        if (f.hasOwnProperty(conf.setupDataKeys.WIDTH)) {
          frameDiv.css(conf.cssProperties.WIDTH, f[conf.setupDataKeys.WIDTH]);
        }
        if (f.hasOwnProperty(conf.setupDataKeys.HEIGHT)) {
          frameDiv.css(conf.cssProperties.HEIGHT, f[conf.setupDataKeys.HEIGHT]);
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

    if (this.setupData.hasOwnProperty(conf.setupDataKeys.VIS_TITLE)) {
      const t = this.setupData[conf.setupDataKeys.VIS_TITLE];
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

    if (this.setupData.hasOwnProperty(conf.setupDataKeys.VIS_DESCRIPTION)) {
      const d = this.setupData[conf.setupDataKeys.VIS_DESCRIPTION];
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

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  CSMesVis.UI = CSMesVisUI;
}(jQuery));




(function($) {
  'use strict';

  const CSMesVisHelpers = function() {
    // Nothing
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

  CSMesVisHelpers.prototype.timestamp = function() {
    return Date.now();
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
