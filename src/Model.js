/**
 * Model class module.
 *
 * @module Model
 */

import * as Config from "./Config.js";
import ErrorFactory from "./ErrorFactory.js";
import Options from "./Options.js";
import Step from "./Step.js";




/** The data model behind the user interface {@link UI}. */
export default class Model {

  constructor(setupData, log) {
    this._name = setupData.name;
    this._options = new Options(setupData);
    this._actors = new Map();
    this._steps = new Map();
    this._currentStepNumber = 1;
    this._log = log;

    for (const [idx, stepData] of setupData[Config.setupDataKeys.STEPS].entries()) {
      const step = new Step(stepData, idx, this._name);
      this._steps.set(idx, step);
    }

    this.emitModelInitializationFinishedEvent();
  }

  moveToFirstStep() {
    if (!this.canMoveToFirstStep) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the first step while already being there.");
    }

    this._currentStepNumber = 1;
    this.emitModelChangedEvent();
  }

  get canMoveToFirstStep() {
    return this.canMoveBackwards;
  }

  moveToPreviousStep() {
    if (!this.canMoveToPreviousStep) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the previous step while already being in the first one.");
    }

    this._currentStepNumber--;
    this.emitModelChangedEvent();
  }

  get canMoveToPreviousStep() {
    return this.canMoveBackwards;
  }

  moveToNextStep() {
    if (!this.canMoveToNextStep) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the next step while already being in the last one.");
    }

    this._currentStepNumber++;
    this.emitModelChangedEvent();
  }

  get canMoveToNextStep() {
    return this.canMoveForwards;
  }

  moveToLastStep() {
    if (!this.canMoveToLastStep) {
      throw ErrorFactory.forModelViolation(
              "Cannot move to the last step while already being there.");
    }

    this._currentStepNumber = this.lastStepNumber;
    this.emitModelChangedEvent();
  }

  get canMoveToLastStep() {
    return this.canMoveForwards;
  }
  
  get canMoveBackwards() {
    return this.hasMultipleSteps && this.isNotAtBeginning;
  }

  get canMoveForwards() {
    return this.hasMultipleSteps && this.isNotAtEnd;
  }
  
  emitModelInitializationFinishedEvent() {
    this.emitEvent(
          Config.eventNames.MODEL_INITIALIZED,
          [this.name,]);
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

  get currentStepNumber() {
    return this._currentStepNumber;
  }

  get currentStepSetup() {
    const s = this._steps.get(this.currentStepNumber - 1);

    return s ? s.setup : [];
  }

  get currentStepTransitionBackwards() {
    const s = this._steps.get(this.currentStepNumber - 1);

    return s ? s.transitionBackwards : [];
  }

  get currentStepTransitionForwards() {
    const s = this._steps.get(this.currentStepNumber - 1);

    return s ? s.transitionForwards : [];
  }

  get isNotAtBeginning() {
    return this.currentStepNumber > 1;
  }

  get isNotAtEnd() {
    return this.currentStepNumber < this._steps.size;
  }

  get hasMultipleSteps() {
    return this.lastStepNumber > 1;
  }

  get lastStepNumber() {
    return this._steps.size;
  }

  get isStepCounterVisible() {
    return this._options.isStepCounterVisible;
  }
  
  get isStepCounterTotalVisible() {
    return this._options.isStepCounterTotalVisible;
  }

  get stepCounterTitle() {
    return this._options.stepCounterTitle;
  }

  get ignoreVisibility() {
    return this._options.ignoreVisibility;
  }

  get highlightActorBorders() {
    return this._options.highlightActorBorders;
  }

}
