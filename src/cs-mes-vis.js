(function() {
  'use strict';

  if (!window.hasOwnProperty("CSMesVis")) {
    window.CSMesVis = {};
  }

  window.CSMesVis.config = {
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
      HEIGHT:                         "height"
    },

    htmlAttributes: {
      VISUALIZATION_NAME:             "cmsv-name",
      CLASS:                          "class"
    },

    htmlTags: {
      TAG_START:                      "<",
      SINGLE_TAG_END:                 "/>",
      DIV:                            "div",
      BUTTON:                         "button"
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
      VIS_ACTORS:                     "actors"
    },

    uiTexts: {
      TO_FIRST_STEP_TITLE:            "First Step",
      TO_PREVIOUS_STEP_TITLE:         "Previous Step",
      TO_NEXT_STEP_TITLE:             "Next Step",
      TO_LAST_STEP_TITLE:             "Last Step"
    }
  };
}());




(function($) {
  'use strict';

  const CSMesVis = function(container, setupData, config, helper) {
    this.container = container;
    this.setupData = setupData;
    this.config = config;
    this.name = setupData.name;
    this.helper = helper;
    this.frames = {};
    this.buttons = {};
  }

  CSMesVis.prototype.init = function() {
    this.createOuterFrame();
    this.createAnimationFrame();
    this.createControlFrame();
  }

  CSMesVis.prototype.createControlFrame = function() {
    const frame = this.helper.createHtmlDiv(this.config.cssClasses.CSMV_CONTROL_FRAME);
    frame.appendTo(this.frames.outer);
    this.frames.control = frame;

    var toFirstStepTitle = this.config.uiTexts.TO_FIRST_STEP_TITLE;
    var toPreviousStepTitle = this.config.uiTexts.TO_PREVIOUS_STEP_TITLE;
    var toNextStepTitle = this.config.uiTexts.TO_NEXT_STEP_TITLE;
    var toLastStepTitle = this.config.uiTexts.TO_LAST_STEP_TITLE;

    if (this.setupData.hasOwnProperty(this.config.setupDataKeys.VIS_ENV)) {
      const e = this.setupData[this.config.setupDataKeys.VIS_ENV];

      if (e.hasOwnProperty(this.config.setupDataKeys.BUTTONS)) {
        const b = e[this.config.setupDataKeys.BUTTONS];

        if (b.hasOwnProperty(this.config.setupDataKeys.TO_FIRST_STEP_TITLE)) {
          toFirstStepTitle = b[this.config.setupDataKeys.TO_FIRST_STEP_TITLE];
        }
        if (b.hasOwnProperty(this.config.setupDataKeys.TO_PREVIOUS_STEP_TITLE)) {
          toPreviousStepTitle = b[this.config.setupDataKeys.TO_PREVIOUS_STEP_TITLE];
        }
        if (b.hasOwnProperty(this.config.setupDataKeys.TO_NEXT_STEP_TITLE)) {
          toNextStepTitle = b[this.config.setupDataKeys.TO_NEXT_STEP_TITLE];
        }
        if (b.hasOwnProperty(this.config.setupDataKeys.TO_LAST_STEP_TITLE)) {
          toLastStepTitle = b[this.config.setupDataKeys.TO_LAST_STEP_TITLE];
        }
      }
    }

    this.buttons.toFirstStep = this.createButton(
          toFirstStepTitle, this.config.cssClasses.CSMV_BUTTON_TO_FIRST_STEP, frame);

    this.buttons.toPreviousStep = this.createButton(
          toPreviousStepTitle, this.config.cssClasses.CSMV_BUTTON_TO_PREVIOUS_STEP, frame);

    this.buttons.toNextStep = this.createButton(
          toNextStepTitle, this.config.cssClasses.CSMV_BUTTON_TO_NEXT_STEP, frame);

    this.buttons.toLastStep = this.createButton(
          toLastStepTitle, this.config.cssClasses.CSMV_BUTTON_TO_LAST_STEP, frame);
  }

  CSMesVis.prototype.createButton = function(title, cssClass, parent) {
    const b = this.helper.createHtmlButton(this.config.cssClasses.CSMV_BUTTON);
    b.text(title);
    if (this.helper.isNonEmptyString(cssClass)) {
      b.addClass(cssClass);
    }
    b.appendTo(parent);
    return b;
  }

  CSMesVis.prototype.createAnimationFrame = function() {
    const frameDiv = this.helper.createHtmlDiv(this.config.cssClasses.CSMV_ANIMATION_FRAME);

    if (this.setupData.hasOwnProperty(this.config.setupDataKeys.VIS_ENV)) {
      const e = this.setupData[this.config.setupDataKeys.VIS_ENV];

      if (e.hasOwnProperty(this.config.setupDataKeys.VIS_ANIMATION_FRAME)) {
        const f = e[this.config.setupDataKeys.VIS_ANIMATION_FRAME];

        if (f.hasOwnProperty(this.config.setupDataKeys.WIDTH)) {
          frameDiv.css(this.config.cssProperties.WIDTH, f[this.config.setupDataKeys.WIDTH]);
        }
        if (f.hasOwnProperty(this.config.setupDataKeys.HEIGHT)) {
          frameDiv.css(this.config.cssProperties.HEIGHT, f[this.config.setupDataKeys.HEIGHT]);
        }
      }
    }

    frameDiv.appendTo(this.frames.outer);
    this.frames.animation = frameDiv;
  }

  CSMesVis.prototype.createOuterFrame = function() {
    const frameDiv = this.helper.createHtmlDiv(this.config.cssClasses.CSMV_OUTER_FRAME);
    frameDiv.appendTo(this.container);
    this.frames.outer = frameDiv;

    if (this.setupData.hasOwnProperty(this.config.setupDataKeys.VIS_TITLE)) {
      const t = this.setupData[this.config.setupDataKeys.VIS_TITLE];
      if (this.helper.isNonEmptyString(t)) {
        const title = $.trim(t);
        const titleDiv = this.helper.createHtmlDiv(this.config.cssClasses.CSMV_VIS_TITLE);
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

    if (this.setupData.hasOwnProperty(this.config.setupDataKeys.VIS_DESCRIPTION)) {
      const d = this.setupData[this.config.setupDataKeys.VIS_DESCRIPTION];
      if (this.helper.isNonEmptyString(d)) {
        const desc = $.trim(d);
        const descDiv = this.helper.createHtmlDiv(this.config.cssClasses.CSMV_VIS_DESCRIPTION);
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




  const CSMesVisBootstrapper = function(csMesVis) {
    this.setupData = csMesVis.setupData;
    this.config = csMesVis.config;
  }

  CSMesVisBootstrapper.prototype.execute = function() {
    const helper = new CSMesVisHelpers(this.config);

    if (this.setupData == null) {
      throw new CSMesVisError("Configuration using CSMesVis.setupData is missing.");
    }
    if (!Array.isArray(this.setupData)) {
      const msg = "The root element must be an array.";
      throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
    }

    const allVisualizationElements = $("." + this.config.cssClasses.CSMV_VISUALIZATION);
    if (allVisualizationElements.length != this.setupData.length) {
      const msg = "There are " + allVisualizationElements.length +
                  " visualization(s) in the HTML file but setup data is given for " +
                  this.setupData.length + " visualiation(s).";

      // TODO: Print lists of names of both the existing divs and setups

      throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
    }

    this.setupData.forEach(function(visualizationSetup, idx) {
      if (!visualizationSetup.hasOwnProperty(this.config.setupDataKeys.VIS_NAME)) {
        const msg = (idx + 1) + ". visualization does not have a name.";
        throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
      }

      // TODO: Is the name a non-empty string? if (this.helper.isNonEmptyString(t)) {

      // console.log(visualizationSetup.name);

      const visualizationElements =
              $("." + this.config.cssClasses.CSMV_VISUALIZATION +
              "[" + this.config.htmlAttributes.VISUALIZATION_NAME + "='" +
              visualizationSetup.name + "']");

      if (visualizationElements.length === 0) {
        const msg = "Setup data is given for visualization '" +  visualizationSetup.name +
                    "', but the HTML file does not contain a container element for it.";
        throw new CSMesVisError(helper.incorrectSetupMessage(msg));
      }
      if (visualizationElements.length > 1) {
        const msg = "The HTML file contains multiple container element for visualization '" +
                    visualizationSetup.name + "'."
        throw new CSMesVisError(helper.incorrectSetupMessage(msg));
      }
      const visualizationContainer = visualizationElements[0];
      //console.log(visualizationContainer);

      const V = new CSMesVis(visualizationContainer, visualizationSetup, this.config, helper);
      V.init();
    }, this);
  }

  $(document).ready(function() {
    new CSMesVisBootstrapper(window.CSMesVis).execute();
  });







  const CSMesVisHelpers = function(config) {
    this.config = config;
  }

  CSMesVisHelpers.prototype.createHtmlDiv = function(cssClass) {
    return this.createHtmlTag(this.config.htmlTags.DIV, cssClass);
  }

  CSMesVisHelpers.prototype.createHtmlButton = function(cssClass) {
    return this.createHtmlTag(this.config.htmlTags.BUTTON, cssClass);
  }

  CSMesVisHelpers.prototype.createHtmlTag = function(tagName, cssClass) {
    const tag = this.config.htmlTags.TAG_START + tagName + this.config.htmlTags.SINGLE_TAG_END;
    const attributes = {};
    attributes[this.config.htmlAttributes.CLASS] = cssClass;
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





  const CSMesVisError = function(message) {
    this.message = this.formatErrorMessage(message);
  }

  CSMesVisError.prototype = new Error();

  CSMesVisError.prototype.formatErrorMessage = function(message) {
    return this.ensureThatEndsWithPeriod(window.CSMesVis.config.application.NAME + ": " + message);
  }

  CSMesVisError.prototype.ensureThatEndsWithPeriod = function(s) {
    if (s.charAt(s.length - 1) != ".")
      return s + ".";

    return s;
  }

}(jQuery));
