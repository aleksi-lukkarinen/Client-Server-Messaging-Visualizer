/**
 * Constants for internal configuration.
 *
 * @module Config
 */


/** Constants related to the application as a whole. */
export const application = {
  NAME:                           "Client-Server Messaging Visualizer",
}




/** Constants representing CSS classes used by the application. */
export const cssClasses = {
  CSMV_ACTOR:                     "csmv-actor",
  CSMV_ACTOR_CONTENT:             "csmv-actor-content",
  CSMV_ACTOR_STEREOTYPE:          "csmv-actor-stereotype",
  CSMV_ACTOR_TITLE:               "csmv-actor-title",
  CSMV_ANIMATION_FRAME:           "csmv-animation-frame",
  CSMV_BUTTON:                    "csmv-button",
  CSMV_BUTTON_TO_FIRST_STEP:      "csmv-button-first-step",
  CSMV_BUTTON_TO_LAST_STEP:       "csmv-button-last-step",
  CSMV_BUTTON_TO_NEXT_STEP:       "csmv-button-next-step",
  CSMV_BUTTON_TO_PREVIOUS_STEP:   "csmv-button-previous-step",
  CSMV_CONTROL_FRAME:             "csmv-control-frame",
  CSMV_CUSTOM_ACTOR:              "csmv-custom-actor",
  CSMV_DEBUG_BORDER:              "csmv-debug-border",
  CSMV_DISABLED:                  "csmv-disabled",
  CSMV_ENABLED:                   "csmv-enabled",
  CSMV_OUTER_FRAME:               "csmv-outer-frame",
  CSMV_PRESET_BROWSER:            "csmv-preset-browser",
  CSMV_PRESET_SERVER:             "csmv-preset-server",
  CSMV_PRESET_TEXTBLOCK:          "csmv-preset-textblock",
  CSMV_PRESET_TEXTBLOCK_CONTENT:  "csmv-preset-textblock-content",
  CSMV_PRESET_TEXTBLOCK_TITLE:    "csmv-preset-textblock-title",
  CSMV_VISUALIZATION:             "csmv-visualization",
  CSMV_VIS_DESCRIPTION:           "csmv-visualization-description",
  CSMV_VIS_TITLE:                 "csmv-visualization-title",
}




/** Constants representing CSS properties used by the application. */
export const cssProperties = {
  WIDTH:                          "width",
  HEIGHT:                         "height",
}




/** Constants representing event names used by the application. */
export const eventNames = {
  /** Emitted before initialization of a visualization begins. */
  INITIALIZATION_BEGINS:          "CSMesVis-initialization-begins",

  /** Emitted when initialization of the data model of a visualization is finished. */
  MODEL_INITIALIZED:              "CSMesVis-model-initialization-finished",

  /** Emitted before initialization of the GUI of a visualization begins. */
  UI_INITIALIZATION_BEGINS:       "CSMesVis-ui-initialization-begins",

  /** Emitted after initialization of the GUI of a visualization is finished. */
  UI_INITIALIZATION_FINISHED:     "CSMesVis-ui-initialization-finished",

  /** Emitted after initialization of a visualization is finished. */
  INITIALIZATION_FINISHED:        "CSMesVis-initialization-finished",

  /** Emitted when the "First Step" button in the GUI is clicked. */
  TO_FIRST_STEP_CLICKED:          "CSMesVis-ui-to-first-step-button-clicked",

  /** Emitted when the "Previous Step" button in the GUI is clicked. */
  TO_PREVIOUS_STEP_CLICKED:       "CSMesVis-ui-to-previous-step-button-clicked",

  /** Emitted when the "Next Step" button in the GUI is clicked. */
  TO_NEXT_STEP_CLICKED:           "CSMesVis-ui-to-next-step-button-clicked",

  /** Emitted when the "Last Step" button in the GUI is clicked. */
  TO_LAST_STEP_CLICKED:           "CSMesVis-ui-to-last-step-button-clicked",

  /** Emitted after the state of the data model of a visualization has changed. */
  MODEL_CHANGED:                  "CSMesVis-model-changed",

  /** A convenience string that contains the names of all the events used in this application. */
  ALL_EVENTS:                     "",   // The string is created programmatically below
}

// Create a convenience constant that contains all event names.
let allEvents = "";
for (let n in eventNames) {
  if (eventNames.hasOwnProperty(n)) {
    allEvents = allEvents + " " + eventNames[n];
  }
}
eventNames.ALL_EVENTS = allEvents.substring(0, allEvents.length);




/** Constants representing HTML attributes used by the application. */
export const htmlAttributes = {
  CSMV_NAME:                      "cmsv-name",
  CLASS:                          "class",
  DISABLED:                       "disabled",
}




/** Constants representing HTML tags used by the application. */
export const htmlTags = {
  TAG_START:                      "<",
  SINGLE_TAG_END:                 "/>",
  DIV:                            "div",
  BUTTON:                         "button",
}




/** Constants representing the strings that identify log events. */
export const loggingKeys = {
  METADATA:                       "Metadata",
  INITIALIZATION_BEGINS:          "Initialization begins",
  INITIALIZATION_FINISHED:        "Initialization finished",
  TO_FIRST_STEP_CLICKED:          "'First' button clicked",
  TO_PREVIOUS_STEP_CLICKED:       "'Previous' button clicked",
  TO_NEXT_STEP_CLICKED:           "'Next' button clicked",
  TO_LAST_STEP_CLICKED:           "'Last' button clicked",
}




/**
 * Constant representing the name of the document object property
 * that must contain the setup data array for the visualizations.
 */
export const SETUP_DATA_ROOT_KEY = "CSMesVisSetupData";

/**
 * Constants representing keys used in the setup data array
 * for the visualizations.
 */
export const setupDataKeys = {
  ACTORS:                         "actors",
  ANIMATION_FRAME:                "animationFrame",
  BUTTONS:                        "buttons",
  CONTENT:                        "content",
  CONTENT_HTML:                   "contentHTML",
  CSS_CLASSES:                    "cssClasses",
  DEBUG:                          "debug",
  DESCRIPTION:                    "description",
  ENV:                            "environment",
  HEIGHT:                         "height",
  HIGHLIGHT_ACTOR_BORDERS:        "highlightActorBorders",
  ID:                             "id",
  IGNORE_VISIBILITY:              "ignoreVisibility",
  NAME:                           "name",
  PRESET:                         "preset",
  SETUP:                          "setup",
  SHOW_TO_LAST_STEP_BUTTON:       "showToLastStepButton",
  STEPS:                          "steps",
  STEREOTYPE:                     "stereotype",
  TITLE:                          "title",
  TO_FIRST_STEP_TITLE:            "toFirstStepTitle",
  TO_LAST_STEP_TITLE:             "toLastStepTitle",
  TO_NEXT_STEP_TITLE:             "toNextStepTitle",
  TO_PREVIOUS_STEP_TITLE:         "toPreviousStepTitle",
  TRANSITION_BACKWARDS:           "transitionBackwards",
  TRANSITION_FORWARDS:            "transitionForwards",
  WIDTH:                          "width",
}




/**
 * Constants representing texts visible in
 * the user interface of the application.
 */
export const uiTexts = {
  TO_FIRST_STEP_TITLE:            "First Step",
  TO_PREVIOUS_STEP_TITLE:         "Previous Step",
  TO_NEXT_STEP_TITLE:             "Next Step",
  TO_LAST_STEP_TITLE:             "Last Step",
}
