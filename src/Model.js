/**
 * Model class module.
 *
 * @module Model
 */

import * as Config from "./Config.js";
import ErrorFactory from "./ErrorFactory.js";




/** The data model behind the user interface {@link UI}. */
export default class Model {

  constructor(ui, setupData, log) {
    this.ui = ui;
    this.name = setupData.name;
    this.log = log;
    this.actors = {};
    this.steps = [];
    this.currentStep = 1;

    this.setupModel(setupData);
  }

  setupModel(setupData) {
    for (let step of setupData.steps) {
      this.steps.push(step);
    }

    this.currentStep = 1;
    console.log(this.steps);
    this.emitModelChangedEvent();
  }

  moveToFirstStep() {
    if (!this.canMoveToFirstStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the first step while already being there.");
    }

    this.currentStep = 1;
    this.emitModelChangedEvent();
  }

  canMoveToFirstStep() {
    return this.steps.length > 1
            && this.currentStep > 1;
  }

  moveToPreviousStep() {
    if (!this.canMoveToPreviousStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the previous step while already being in the first one.");
    }

    this.currentStep = this.currentStep - 1;
    this.emitModelChangedEvent();
  }

  canMoveToPreviousStep() {
    return this.steps.length > 1
            && this.currentStep > 1;
  }

  moveToNextStep() {
    if (!this.canMoveToNextStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the next step while already being in the last one.");
    }

    this.currentStep = this.currentStep + 1;
    this.emitModelChangedEvent();
  }

  canMoveToNextStep() {
    return this.steps.length > 1
            && this.currentStep < this.steps.length;
  }

  moveToLastStep() {
    if (!this.canMoveToLastStep()) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the last step while already being there.");
    }

    this.currentStep = this.steps.length;
    this.emitModelChangedEvent();
  }

  canMoveToLastStep() {
    return this.steps.length > 1
            && this.currentStep < this.steps.length;
  }

  emitModelChangedEvent() {
    this.emitEvent(
          Config.eventNames.MODEL_CHANGED,
          [this.name,]);
  }

  emitEvent(id, params) {
    const e = $.Event(id);
    $(this).trigger(e, params);
  }

}
