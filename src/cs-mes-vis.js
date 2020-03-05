


var Config = {
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






const CSMesVis = function(container, setupData, helper) {
  this.container = container;
  this.setupData = setupData;
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
  const frame = this.helper.createHtmlDiv(Config.cssClasses.CSMV_CONTROL_FRAME);
  frame.appendTo(this.frames.outer);
  this.frames.control = frame;

  var toFirstStepTitle = Config.uiTexts.TO_FIRST_STEP_TITLE;
  var toPreviousStepTitle = Config.uiTexts.TO_PREVIOUS_STEP_TITLE;
  var toNextStepTitle = Config.uiTexts.TO_NEXT_STEP_TITLE;
  var toLastStepTitle = Config.uiTexts.TO_LAST_STEP_TITLE;
  
  if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_ENV)) {
    const e = this.setupData[Config.setupDataKeys.VIS_ENV];

    if (e.hasOwnProperty(Config.setupDataKeys.BUTTONS)) {
      const b = e[Config.setupDataKeys.BUTTONS];

      if (b.hasOwnProperty(Config.setupDataKeys.TO_FIRST_STEP_TITLE)) {
        toFirstStepTitle = b[Config.setupDataKeys.TO_FIRST_STEP_TITLE];
      }
      if (b.hasOwnProperty(Config.setupDataKeys.TO_PREVIOUS_STEP_TITLE)) {
        toPreviousStepTitle = b[Config.setupDataKeys.TO_PREVIOUS_STEP_TITLE];
      }
      if (b.hasOwnProperty(Config.setupDataKeys.TO_NEXT_STEP_TITLE)) {
        toNextStepTitle = b[Config.setupDataKeys.TO_NEXT_STEP_TITLE];
      }
      if (b.hasOwnProperty(Config.setupDataKeys.TO_LAST_STEP_TITLE)) {
        toLastStepTitle = b[Config.setupDataKeys.TO_LAST_STEP_TITLE];
      }
    }
  }

  this.buttons.toFirstStep = this.createButton(
        toFirstStepTitle, Config.cssClasses.CSMV_BUTTON_TO_FIRST_STEP, frame);

  this.buttons.toPreviousStep = this.createButton(
        toPreviousStepTitle, Config.cssClasses.CSMV_BUTTON_TO_PREVIOUS_STEP, frame);

  this.buttons.toNextStep = this.createButton(
        toNextStepTitle, Config.cssClasses.CSMV_BUTTON_TO_NEXT_STEP, frame);

  this.buttons.toLastStep = this.createButton(
        toLastStepTitle, Config.cssClasses.CSMV_BUTTON_TO_LAST_STEP, frame);
}

CSMesVis.prototype.createButton = function(title, cssClass, parent) {
  const b = this.helper.createHtmlButton(Config.cssClasses.CSMV_BUTTON);
  b.text(title);
  if (this.helper.isNonEmptyString(cssClass)) {
    b.addClass(cssClass);
  }
  b.appendTo(parent);
  return b;
}

CSMesVis.prototype.createAnimationFrame = function() {
  const frameDiv = this.helper.createHtmlDiv(Config.cssClasses.CSMV_ANIMATION_FRAME);

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
}

CSMesVis.prototype.createOuterFrame = function() {
  const frameDiv = this.helper.createHtmlDiv(Config.cssClasses.CSMV_OUTER_FRAME);
  frameDiv.appendTo(this.container);
  this.frames.outer = frameDiv;
  
  if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_TITLE)) {
    const t = this.setupData[Config.setupDataKeys.VIS_TITLE];
    if (this.helper.isNonEmptyString(t)) {
      const title = $.trim(t);
      const titleDiv = this.helper.createHtmlDiv(Config.cssClasses.CSMV_VIS_TITLE);
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

  if (this.setupData.hasOwnProperty(Config.setupDataKeys.VIS_DESCRIPTION)) {
    const d = this.setupData[Config.setupDataKeys.VIS_DESCRIPTION];
    if (this.helper.isNonEmptyString(d)) {
      const desc = $.trim(d);
      const descDiv = this.helper.createHtmlDiv(Config.cssClasses.CSMV_VIS_DESCRIPTION);
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





const CSMesVisBootstrapper = function(setupData) {
  this.setupData = setupData;
}

CSMesVisBootstrapper.prototype.execute = function() {
  const helper = new CSMesVisHelpers();
  
  if (this.setupData == null) {
    throw new CSMesVisError("Configuration using CSMesVis.setupData is missing.");
  }
  if (!Array.isArray(this.setupData)) {
    const msg = "The root element must be an array.";
    throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
  }

  const allVisualizationElements = $("." + Config.cssClasses.CSMV_VISUALIZATION);
  if (allVisualizationElements.length != this.setupData.length) {
    const msg = "There are " + allVisualizationElements.length + 
                " visualization(s) in the HTML file but setup data is given for " + 
                this.setupData.length + " visualiation(s).";
                
    // TODO: Print lists of names of both the existing divs and setups

    throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
  }

  this.setupData.forEach(function(visualizationSetup, idx) {
    if (!visualizationSetup.hasOwnProperty(Config.setupDataKeys.VIS_NAME)) {
      const msg = (idx + 1) + ". visualization does not have a name.";
      throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
    }
    
    // TODO: Is the name a non-empty string? if (this.helper.isNonEmptyString(t)) {

    // console.log(visualizationSetup.name);

    const visualizationElements = $("." + Config.cssClasses.CSMV_VISUALIZATION + 
                "[" + Config.htmlAttributes.VISUALIZATION_NAME + "='" + visualizationSetup.name + "']");

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

    const V = new CSMesVis(visualizationContainer, visualizationSetup, helper);
    V.init();
  });
}







const CSMesVisHelpers = function() {
  // Nothing
}

CSMesVisHelpers.prototype.createHtmlDiv = function(cssClass) {
  return this.createHtmlTag(Config.htmlTags.DIV, cssClass);
}

CSMesVisHelpers.prototype.createHtmlButton = function(cssClass) {
  return this.createHtmlTag(Config.htmlTags.BUTTON, cssClass);
}

CSMesVisHelpers.prototype.createHtmlTag = function(tagName, cssClass) {
  const tag = Config.htmlTags.TAG_START + tagName + Config.htmlTags.SINGLE_TAG_END;
  const attributes = {};
  attributes[Config.htmlAttributes.CLASS] = cssClass;
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
  return this.ensureThatEndsWithPeriod(Config.application.NAME + ": " + message);
}

CSMesVisError.prototype.ensureThatEndsWithPeriod = function(s) {
  if (s.charAt(s.length - 1) != ".")
    return s + ".";

  return s;
}





$(document).ready(function() {
  new CSMesVisBootstrapper(CSMesVis.setupData).execute();
});
