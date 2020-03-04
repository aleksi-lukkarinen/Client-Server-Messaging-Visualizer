const appName = "Client-Server Messaging Visualizer";

const classCsmvVisualization = "csmv-visualization";
const classCsmvOuterFrame = "csmv-outer-frame";
const classCsmvVisTitle = "csmv-visualization-title";
const classCsmvVisDescription = "csmv-visualization-description";
const classCsmvAnimationFrame = "csmv-animation-frame";
const classCsmvControlFrame = "csmv-control-frame";
const classCsmvButton = "csmv-button";

const attrVisualizationName = "cmsv-name";

const dataKeyVisName = "name";
const dataKeyVisTitle = "title";
const dataKeyVisDescription = "description";
const dataKeyVisEnv = "environment";
const dataKeyVisAnimationFrame = "animationFrame";
const dataKeyWidth = "width";
const dataKeyHeight = "height";
const dataKeyButtons = "buttons";
const dataKeyToFirstStepTitle = "toFirstStepTitle";
const dataKeyToPreviousStepTitle = "toPreviousStepTitle";
const dataKeyToNextStepTitle = "toNextStepTitle";
const dataKeyToLastStepTitle = "toLastStepTitle";
const dataKeyVisActors = "actors";






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
  const frame = this.helper.createHtmlDiv(classCsmvControlFrame);
  frame.appendTo(this.frames.outer);
  this.frames.control = frame;

  var toFirstStepTitle = "First Step";
  var toPreviousStepTitle = "Previous Step";
  var toNextStepTitle = "Next Step";
  var toLastStepTitle = "Last Step";
  
  if (this.setupData.hasOwnProperty(dataKeyVisEnv)) {
    const e = this.setupData[dataKeyVisEnv];

    if (e.hasOwnProperty(dataKeyButtons)) {
      const b = e[dataKeyButtons];

      if (b.hasOwnProperty(dataKeyToFirstStepTitle)) {
        toFirstStepTitle = b[dataKeyToFirstStepTitle];
      }
      if (b.hasOwnProperty(dataKeyToPreviousStepTitle)) {
        toPreviousStepTitle = b[dataKeyToPreviousStepTitle];
      }
      if (b.hasOwnProperty(dataKeyToNextStepTitle)) {
        toNextStepTitle = b[dataKeyToNextStepTitle];
      }
      if (b.hasOwnProperty(dataKeyToLastStepTitle)) {
        toLastStepTitle = b[dataKeyToLastStepTitle];
      }
    }
  }

  this.buttons.toFirstStep = this.createButton(
        toFirstStepTitle, "csmv-button-first-step", frame);

  this.buttons.toPreviousStep = this.createButton(
        toPreviousStepTitle, "csmv-button-previous-step", frame);

  this.buttons.toNextStep = this.createButton(
        toNextStepTitle, "csmv-button-next-step", frame);

  this.buttons.toLastStep = this.createButton(
        toLastStepTitle, "csmv-button-last-step", frame);
}

CSMesVis.prototype.createButton = function(title, cssClass, parent) {
  const b = this.helper.createHtmlButton(classCsmvButton);
  b.text(title);
  if (this.helper.isNonEmptyString(cssClass)) {
    b.addClass(cssClass);
  }
  b.appendTo(parent);
  return b;
}

CSMesVis.prototype.createAnimationFrame = function() {
  const frameDiv = this.helper.createHtmlDiv(classCsmvAnimationFrame);

  if (this.setupData.hasOwnProperty(dataKeyVisEnv)) {
    const e = this.setupData[dataKeyVisEnv];

    if (e.hasOwnProperty(dataKeyVisAnimationFrame)) {
      const f = e[dataKeyVisAnimationFrame];

      if (f.hasOwnProperty(dataKeyWidth)) {
        frameDiv.css("width", f[dataKeyWidth]);
      }
      if (f.hasOwnProperty(dataKeyHeight)) {
        frameDiv.css("height", f[dataKeyHeight]);
      }
    }
  }

  frameDiv.appendTo(this.frames.outer);
  this.frames.animation = frameDiv;
}

CSMesVis.prototype.createOuterFrame = function() {
  const frameDiv = this.helper.createHtmlDiv(classCsmvOuterFrame);
  frameDiv.appendTo(this.container);
  this.frames.outer = frameDiv;
  
  if (this.setupData.hasOwnProperty(dataKeyVisTitle)) {
    const t = this.setupData[dataKeyVisTitle];
    if (this.helper.isNonEmptyString(t)) {
      const titleDiv = this.helper.createHtmlDiv(classCsmvVisTitle);
      titleDiv.text(t);
      titleDiv.appendTo(frameDiv);
      this.title = t;
      this.titleDiv = titleDiv;
    }
    else {
      const msg = "Visualization '" + this.name + "' has an invalid title; " +
                  "it must be a string that contains not only whitespace.";
      throw new CSMesVisError(this.helper.incorrectSetupDataMessage(msg));
    }
  }

  if (this.setupData.hasOwnProperty(dataKeyVisDescription)) {
    const d = this.setupData[dataKeyVisDescription];
    if (this.helper.isNonEmptyString(d)) {
      const descDiv = this.helper.createHtmlDiv(classCsmvVisDescription);
      descDiv.text(d);
      descDiv.appendTo(frameDiv);
      this.description = d;
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

  const allVisualizationElements = $("." + classCsmvVisualization);
  if (allVisualizationElements.length != this.setupData.length) {
    const msg = "There are " + allVisualizationElements.length + 
                " visualization(s) in the HTML file but setup data is given for " + 
                this.setupData.length + " visualiation(s).";

    throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
  }

  this.setupData.forEach(function(visualizationSetup, idx) {
    if (!visualizationSetup.hasOwnProperty(dataKeyVisName)) {
      const msg = (idx + 1) + ". visualization does not have a name.";
      throw new CSMesVisError(helper.incorrectSetupDataMessage(msg));
    }

    console.log(visualizationSetup.name);

    const visualizationElements = $("." + classCsmvVisualization + 
                "[" + attrVisualizationName + "='" + visualizationSetup.name + "']");

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
    console.log(visualizationContainer);

    const V = new CSMesVis(visualizationContainer, visualizationSetup, helper);
    V.init();
  });
}







const CSMesVisHelpers = function() {
  // Nothing
}

CSMesVisHelpers.prototype.createHtmlDiv = function(cssClass) {
  return this.createHtmlElement("div", cssClass);
}

CSMesVisHelpers.prototype.createHtmlButton = function(cssClass) {
  return this.createHtmlElement("button", cssClass);
}

CSMesVisHelpers.prototype.createHtmlElement = function(elementName, cssClass) {
  return $("<" + elementName + "/>", {"class": cssClass});
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
  return this.ensureThatEndsWithPeriod(appName + ": " + message);
}

CSMesVisError.prototype.ensureThatEndsWithPeriod = function(s) {
  if (s.charAt(s.length - 1) != ".")
    return s + ".";

  return s;
}





$(document).ready(function() {
  const b = new CSMesVisBootstrapper(CSMesVis.setupData);
  b.execute();
});
