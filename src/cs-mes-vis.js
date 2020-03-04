const appName = "Client-Server Messaging Visualizer";

const classCsmvVisualization = "csmv-visualization";
const classCsmvOuterFrame = "csmv-outer-frame";
const classCsmvAnimationFrame = "csmv-animation-frame";
const classCsmvControlFrame = "csmv-control-frame";
const classCsmvButton = "csmv-button";

const attrVisualizationName = "cmsv-name";

const dataKeyVisName = "name";
const dataKeyVisEnv = "environment";
const dataKeyVisAnimationFrame = "animationFrame";
const dataKeyWidth = "width";
const dataKeyHeight = "height";
const dataKeyVisActors = "actors";



const CSMesVis = function(container, setupData) {
  this.container = container;
  this.setupData = setupData;
  this.frames = {};
  this.buttons = {};
}

CSMesVis.prototype.init = function() {
   this.createOuterFrame();
   this.createAnimationFrame();
   this.createControlFrame();
}

CSMesVis.prototype.createControlFrame = function() {
  const frame = this.createHtmlDiv(classCsmvControlFrame);
  frame.appendTo(this.frames.outer);
  this.frames.control = frame;
  
  this.buttons.toFirstStep    = this.createButton("First Step", "csmv-button-first-step", frame);
  this.buttons.toPreviousStep = this.createButton("Previous Step", "csmv-button-previous-step", frame);
  this.buttons.toNextStep     = this.createButton("Next Step", "csmv-button-next-step", frame);
  this.buttons.toLastStep     = this.createButton("Last Step", "csmv-button-last-step", frame);
}

CSMesVis.prototype.createButton = function(title, cssClass, parent) {
  const b = this.createHtmlButton(classCsmvButton);
  b.text(title);
  if (typeof(cssClass) === "string" && cssClass.length > 0) {
    b.addClass(cssClass);
  }
  b.appendTo(parent);
  return b;
}

CSMesVis.prototype.createAnimationFrame = function() {
  const frame = this.createHtmlDiv(classCsmvAnimationFrame);

  if (this.setupData.hasOwnProperty(dataKeyVisEnv)) {
    const e = this.setupData[dataKeyVisEnv];

    if (e.hasOwnProperty(dataKeyVisAnimationFrame)) {
      const f = e[dataKeyVisAnimationFrame];

      if (f.hasOwnProperty(dataKeyWidth)) {
        frame.css("width", f[dataKeyWidth]);
      }
      if (f.hasOwnProperty(dataKeyHeight)) {
        frame.css("height", f[dataKeyHeight]);
      }
    }
  }

  frame.appendTo(this.frames.outer);
  this.frames.animation = frame;
}

CSMesVis.prototype.createOuterFrame = function() {
  const frame = this.createHtmlDiv(classCsmvOuterFrame);
  frame.appendTo(this.container);
  this.frames.outer = frame;
}

CSMesVis.prototype.createHtmlDiv = function(cssClass) {
  return this.createHtmlElement("div", cssClass);
}

CSMesVis.prototype.createHtmlButton = function(cssClass) {
  return this.createHtmlElement("button", cssClass);
}

CSMesVis.prototype.createHtmlElement = function(elementName, cssClass) {
  return $("<" + elementName + "/>", {"class": cssClass});
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





const CSMesVisBootstrapper = function(setupData) {
  this.setupData = setupData;
}

CSMesVisBootstrapper.prototype.execute = function() {
  if (this.setupData == null) {
    throw new CSMesVisError("Configuration using CSMesVis.setupData is missing.");
  }
  if (!Array.isArray(this.setupData)) {
    const msg = "The root element must be an array.";
    throw new CSMesVisError(this.incorrectSetupDataMessage(msg));
  }

  const allVisualizationElements = $("." + classCsmvVisualization);
  if (allVisualizationElements.length != this.setupData.length) {
    const msg = "There are " + allVisualizationElements.length + 
                " visualization(s) in the HTML file but setup data is given for " + 
                this.setupData.length + " visualiation(s).";

    throw new CSMesVisError(this.incorrectSetupDataMessage(msg));
  }

  this.setupData.forEach(function(visualizationSetup, idx) {
    if (!visualizationSetup.hasOwnProperty(dataKeyVisName)) {
      const msg = (idx + 1) + ". visualization does not have a name.";
      throw new CSMesVisError(this.incorrectSetupDataMessage(msg));
    }

    console.log(visualizationSetup.name);

    const visualizationElements = $("." + classCsmvVisualization + 
                "[" + attrVisualizationName + "='" + visualizationSetup.name + "']");

    if (visualizationElements.length === 0) {
      const msg = "Setup data is given for visualization '" +  visualizationSetup.name + 
                  "', but the HTML file does not contain a container element for it.";
      throw new CSMesVisError(this.incorrectSetupMessage(msg));
    }
    if (visualizationElements.length > 1) {
      const msg = "The HTML file contains multiple container element for visualization '" + 
                  visualizationSetup.name + "'."
      throw new CSMesVisError(this.incorrectSetupMessage(msg));
    }
    const visualizationContainer = visualizationElements[0];
    console.log(visualizationContainer);
    
    const V = new CSMesVis(visualizationContainer, visualizationSetup);
    V.init();
  });
}

CSMesVisBootstrapper.prototype.incorrectSetupDataMessage = function(message) {
  return "Incorrect setup data: " + message;
}

CSMesVisBootstrapper.prototype.incorrectSetupMessage = function(message) {
  return "Incorrect setup: " + message;
}





$(document).ready(function() {
  const b = new CSMesVisBootstrapper(CSMesVis.setupData);
  b.execute();
});
