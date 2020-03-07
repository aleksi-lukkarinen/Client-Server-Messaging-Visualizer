export const CSMesVisError = function(message) {
  this.message = this.formatErrorMessage(message);
};

CSMesVisError.prototype = new Error();

CSMesVisError.prototype.formatErrorMessage = function(message) {
  return this.ensureThatEndsWithPeriod(
          CSMesVis.config.application.NAME + ": " + message);
};

CSMesVisError.prototype.ensureThatEndsWithPeriod = function(s) {
  return !s.endsWith(".") ? s + "." : s;
};

if (!window.hasOwnProperty("CSMesVis")) {
  window.CSMesVis = {};
}

CSMesVis.Error = CSMesVisError;
