const appName = "Client-Server Messaging Visualizer";

const classVisualization = ".csmv-visualization";

const dataKeyEnv = "environment";

const errMsgVisDataNotGiven = "Configuration using CSMesVis.setupData is missing.";


const CSMesVis = function(container, setupData) {
  this.container = container;
  this.setupData = setupData;
}

CSMesVis.prototype.setupData;
CSMesVis.prototype.container;

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





$( document ).ready(function() {
  if (CSMesVis.setupData == null) {
    throw new CSMesVisError(errMsgVisDataNotGiven);
  }
  if (!Array.isArray(CSMesVis.setupData)) {
    throw new CSMesVisError("Incorrect setup data: The root element must be an array.");
  }

  const allVisualizationElements = $(classVisualization);
  if (allVisualizationElements.length != CSMesVis.setupData.length) {
    throw new CSMesVisError(
                  "Incorrect setup data: There are " + allVisualizationElements.length + 
                  " visualization(s) in the HTML file but setup data is given for " + 
                  CSMesVis.setupData.length + " visualiation(s).");
  }

  CSMesVis.setupData.forEach(function(visualizationSetup, idx) {
    if (!visualizationSetup.hasOwnProperty("name")) {
      throw new CSMesVisError("Incorrect setup data: " + (idx + 1) + ". visualization does not have a name.");
    }

    console.log(visualizationSetup.name);

    const visualizationElements = $(classVisualization + "[cmsv-name='" + visualizationSetup.name + "']");
    if (visualizationElements.length === 0) {
      throw new CSMesVisError("Incorrect setup: Setup data is given for visualization '" + visualizationSetup.name + "', but the HTML file does not contain a container element for it.");
    }
    if (visualizationElements.length > 1) {
      throw new CSMesVisError("Incorrect setup: the HTML file contains multiple container element for visualization '" + visualizationSetup.name + "'.");
    }
    const visualizationElement = visualizationElements[0];
    
    console.log(visualizationElement);
    
    const V = new CSMesVis(visualizationElement, visualizationSetup);
    V.init();
  });

});
