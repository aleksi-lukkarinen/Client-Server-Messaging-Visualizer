/**
 * Step class module.
 *
 * @module Step
 */

import * as Config from "./Config.js";
import ErrorFactory from "./ErrorFactory.js";




/** One step of the visualization. */
export default class Step {

  // TODO: Deep copy and validate each accepted instruction

  constructor(stepData, stepIndex, visualizationName) {
    this._setup = [];
    this.initArrayMember(
        stepData, stepIndex, Config.setupDataKeys.SETUP,
        this._setup, visualizationName);

    this._transitionForwards = [];
    this.initArrayMember(
        stepData, stepIndex, Config.setupDataKeys.TRANSITION_FORWARDS,
        this._transitionForwards, visualizationName);

    this._transitionBackwards = [];
    this.initArrayMember(
        stepData, stepIndex, Config.setupDataKeys.TRANSITION_BACKWARDS,
        this._transitionBackwards, visualizationName);
  }

  initArrayMember(stepData, stepIndex, stepDataKey, targetMember, visualizationName) {
    if (stepData.hasOwnProperty(stepDataKey)) {
      if (!Array.isArray(stepData[stepDataKey])) {
        ErrorFactory.forIncorrectSetupData(
          `${stepIndex}. step of '${visualizationName}' has ` +
          `a '${stepDataKey}' key that does not have an array as its value.`);
      }
      this.copyInstructionsFromTo(stepData[stepDataKey], targetMember);
    }
  }

  copyInstructionsFromTo(sourceArray, destinationArray) {
    for (const instruction of sourceArray) {
      destinationArray.push(Object.assign([], instruction));
    }
  }

  get setup() {
    return this._setup;
  }

  get transitionForwards() {
    return this._transitionForwards;
  }

  get transitionBackwards() {
    return this._transitionBackwards;
  }

}
