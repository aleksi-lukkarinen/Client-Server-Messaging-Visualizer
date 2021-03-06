/**
 * Options class module.
 *
 * @module Options
 */

import * as Config from "./Config.js";




/** Options values behing the data model {@link Model}. */
export default class Options {

  constructor(
        setupData,
        appContext,
        sdKeys = Config.setupDataKeys) {

    this._appCtx = appContext;

    this._optionData = {};

    this._ignoreVisibilityPath = `${sdKeys.DEBUG}.${sdKeys.IGNORE_VISIBILITY}`;
    this.parseBooleanOption(setupData, this._ignoreVisibilityPath, false);

    this._hightlightActorBordersPath = `${sdKeys.DEBUG}.${sdKeys.HIGHLIGHT_ACTOR_BORDERS}`;
    this.parseBooleanOption(setupData, this._hightlightActorBordersPath, false);

    this._stepCounterVisiblePath = `${sdKeys.ENV}.${sdKeys.STEP_COUNTER}.${sdKeys.SHOW}`;
    this.parseBooleanOption(setupData, this._stepCounterVisiblePath, true);

    this._stepCounterTotalVisiblePath = `${sdKeys.ENV}.${sdKeys.STEP_COUNTER}.${sdKeys.SHOW_TOTAL}`;
    this.parseBooleanOption(setupData, this._stepCounterTotalVisiblePath, true);

    this._stepCounterTitlePath =
            `${sdKeys.ENV}.${sdKeys.STEP_COUNTER}.${sdKeys.TITLE}`;
    this.parseStringOption(
            setupData,
            this._stepCounterTitlePath,
            Config.uiTexts.STEP_COUNTER_TITLE);

    this._stepCounterNoStepsTitlePath =
            `${sdKeys.ENV}.${sdKeys.STEP_COUNTER}.${sdKeys.NO_STEPS_TITLE}`;
    this.parseStringOption(
            setupData,
            this._stepCounterNoStepsTitlePath,
            Config.uiTexts.STEP_COUNTER_TITLE_NO_STEPS);
  }

  parseBooleanOption(setupData, objectPath, defaultValue, AC = this._appCtx) {
    let val = AC.objectUtils.retrieveHierarchicalValue(setupData, objectPath);
    if (!AC.objectUtils.isBoolean(val)) {
      val = defaultValue;
    }

    this._optionData[objectPath] = val;
  }

  parseStringOption(setupData, objectPath, defaultValue, AC = this._appCtx) {
    let val = AC.objectUtils.retrieveHierarchicalValue(setupData, objectPath);
    if (!AC.stringUtils.isPrimitiveString(val)) {
      val = defaultValue;
    }

    this._optionData[objectPath] = val;
  }

  get isStepCounterVisible() {
    return this._optionData[this._stepCounterVisiblePath];
  }

  get isStepCounterTotalVisible() {
    return this._optionData[this._stepCounterTotalVisiblePath];
  }

  get stepCounterTitle() {
    return this._optionData[this._stepCounterTitlePath];
  }

  get stepCounterNoStepsTitle() {
    return this._optionData[this._stepCounterNoStepsTitlePath];
  }

  get ignoreVisibility() {
    return this._optionData[this._ignoreVisibilityPath];
  }

  get highlightActorBorders() {
    return this._optionData[this._hightlightActorBordersPath];
  }

}
