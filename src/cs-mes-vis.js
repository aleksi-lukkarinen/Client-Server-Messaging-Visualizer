const appName = "Client-Server Messaging Visualizer";

const classVisualization = ".csmv-visualization";

const attrVisualizationName = "cmsv-name";

const dataKeyVisName = "name";
const dataKeyVisEnv = "environment";
const dataKeyVisActors = "actors";

const errMsgVisDataNotGiven = "Configuration using CSMesVis.setupData is missing.";


const CSMesVis = function(container, setupData) {
  this.container = container;
  this.setupData = setupData;
}

CSMesVis.prototype.container;
CSMesVis.prototype.setupData;

CSMesVis.prototype.init = function() {
  this.createFrame();
}

CSMesVis.prototype.createFrame = function() {
  this.container.innerHTML = "<div>frame</div>"
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
    throw new CSMesVisError(errMsgVisDataNotGiven);
  }
  if (!Array.isArray(this.setupData)) {
    throw new CSMesVisError("Incorrect setup data: The root element must be an array.");
  }

  const allVisualizationElements = $(classVisualization);
  if (allVisualizationElements.length != this.setupData.length) {
    const msg = "Incorrect setup data: There are " + allVisualizationElements.length + 
                " visualization(s) in the HTML file but setup data is given for " + 
                this.setupData.length + " visualiation(s).";

    throw new CSMesVisError(msg);
  }

  this.setupData.forEach(function(visualizationSetup, idx) {
    if (!visualizationSetup.hasOwnProperty(dataKeyVisName)) {
      const msg = "Incorrect setup data: " + (idx + 1) + ". visualization does not have a name.";
      throw new CSMesVisError(msg);
    }

    console.log(visualizationSetup.name);

    const visualizationElements = $(classVisualization + 
                "[" + attrVisualizationName + "='" + visualizationSetup.name + "']");

    if (visualizationElements.length === 0) {
      const msg = "Incorrect setup: Setup data is given for visualization '" +  visualizationSetup.name + 
                  "', but the HTML file does not contain a container element for it.";
      throw new CSMesVisError(msg);
    }
    if (visualizationElements.length > 1) {
      const msg = "Incorrect setup: the HTML file contains multiple container element for visualization '" + 
                  visualizationSetup.name + "'."
      throw new CSMesVisError(msg);
    }
    const visualizationElement = visualizationElements[0];
    console.log(visualizationElement);
    
    const V = new CSMesVis(visualizationElement, visualizationSetup);
    V.init();
  });
}



$( document ).ready(function() {
  const booter = new CSMesVisBootstrapper(CSMesVis.setupData);
  booter.execute();
});
