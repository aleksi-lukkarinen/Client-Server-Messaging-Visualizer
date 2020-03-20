/**
 * Model class module.
 *
 * @module Model
 */

import * as Config from "./Config.js";
import Options from "./Options.js";
import Step from "./Step.js";




/** The data model behind the user interface {@link UI}. */
export default class Model {

  constructor(setupData, appContext, log) {
    log.addModelInitializationBeginsEvent();
    this.emitModelInitializationBeginsEvent();

    this._name = setupData.name;
    this._appCtx = appContext;
    this._actors = new Map();
    this._steps = new Map();
    this._currentStepNumber = 1;
    this._log = log;
    this._options = new Options(setupData, appContext);

    for (const [idx, stepData] of setupData[Config.setupDataKeys.STEPS].entries()) {
      const step = new Step(stepData, idx, this._name, this._appCtx);
      this._steps.set(idx, step);
    }

    this.emitModelInitializationFinishedEvent();
    log.addModelInitializationFinishedEvent();
  }

  moveToFirstStep(AC = this._appCtx) {
    if (!this.canMoveToFirstStep) {
      throw AC.errorFactory.forModelViolation(
              "Cannot move to the first step while already being there.");
    }

    this._currentStepNumber = 1;
    this.emitModelChangedEvent();
  }

  get canMoveToFirstStep() {
    return this.canMoveBackwards;
  }

  moveToPreviousStep(AC = this._appCtx) {
    if (!this.canMoveToPreviousStep) {
      throw AC.errorFactory.forModelViolation(
              "Cannot move to the previous step while already being in the first one.");
    }

    this._currentStepNumber--;
    this.emitModelChangedEvent();
  }

  get canMoveToPreviousStep() {
    return this.canMoveBackwards;
  }

  moveToNextStep(AC = this._appCtx) {
    if (!this.canMoveToNextStep) {
      throw AC.errorFactory.forModelViolation(
              "Cannot move to the next step while already being in the last one.");
    }

    this._currentStepNumber++;
    this.emitModelChangedEvent();
  }

  get canMoveToNextStep() {
    return this.canMoveForwards;
  }

  moveToLastStep(AC = this._appCtx) {
    if (!this.canMoveToLastStep) {
      throw AC.errorFactory.forModelViolation(
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

  emitModelInitializationBeginsEvent() {
    this.emitEvent(
          Config.eventNames.MODEL_INITIALIZATION_BEGINS,
          [this._name]);
  }

  emitModelInitializationFinishedEvent() {
    this.emitEvent(
          Config.eventNames.MODEL_INITIALIZATION_FINISHED,
          [this._name]);
  }

  emitModelChangedEvent() {
    this.emitEvent(
          Config.eventNames.MODEL_CHANGED,
          [this._name]);
  }

  emitEvent(id, params) {
    const e = new $.Event(id);
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

  get stepCounterNoStepsTitle() {
    return this._options.stepCounterNoStepsTitle;
  }

  get ignoreVisibility() {
    return this._options.ignoreVisibility;
  }

  get highlightActorBorders() {
    return this._options.highlightActorBorders;
  }

}
